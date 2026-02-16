import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { RegisterInput, LoginInput } from "../utils/validation";
import { JwtPayload } from "../middleware/auth";

const SALT_ROUNDS = 12;

/** Authentication service - handles user registration and login */
export class AuthService {
  /**
   * Register a new user account.
   * Hashes the password and stores the user in the database.
   */
  static async register(input: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw ApiError.conflict("An account with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  /**
   * Authenticate a user with email and password.
   * Returns user data and a JWT token on success.
   */
  static async login(input: LoginInput) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Generate token
    const token = AuthService.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Get user profile by ID (excludes password hash).
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { assignments: true } },
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  /** Generate a signed JWT token */
  private static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);
  }
}
