import type { Request, Response } from 'express';
import type { CreateReviewInput } from '../repositories/reviewRepository.ts';
import { ReviewService } from '../services/reviewService.ts';

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const isCreateReviewInput = (body: unknown): body is CreateReviewInput => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return false;
  const input = body as Record<string, unknown>;
  return (
    Object.keys(input).every((key) => ['stallId', 'userId', 'rating', 'comment'].includes(key)) &&
    isPositiveInteger(input.stallId) &&
    isPositiveInteger(input.userId) &&
    typeof input.rating === 'number' &&
    Number.isInteger(input.rating) &&
    input.rating >= 1 &&
    input.rating <= 5 &&
    (input.comment === undefined || input.comment === null || typeof input.comment === 'string')
  );
};

export class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService = new ReviewService()) {
    this.reviewService = reviewService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'REVIEW_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Data review tidak ditemukan' });
    }
    if (error instanceof Error && error.message === 'STALL_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Data warung tidak ditemukan' });
    }
    if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ status: 'fail', message: 'Data pengguna tidak ditemukan' });
    }
    if (
      error &&
      typeof error === 'object' &&
      'number' in error &&
      (error.number === 2601 || error.number === 2627)
    ) {
      return res.status(409).json({
        status: 'fail',
        message: 'Pengguna sudah memberikan review untuk warung ini',
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getReviews = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const reviews = await this.reviewService.getAllReviews();
      return res.status(200).json({ status: 'success', data: reviews });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createReview = async (req: Request, res: Response): Promise<Response> => {
    if (!isCreateReviewInput(req.body)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Body harus berisi stallId dan userId positif, rating 1 sampai 5, serta comment opsional',
      });
    }
    try {
      const review = await this.reviewService.createReview({
        ...req.body,
        ...(typeof req.body.comment === 'string' ? { comment: req.body.comment.trim() } : {}),
      });
      return res.status(201).json({ status: 'success', data: review });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteReview = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    if (!isPositiveInteger(id)) {
      return res.status(400).json({ status: 'fail', message: 'id harus berupa bilangan bulat positif' });
    }
    try {
      const review = await this.reviewService.deleteReview(id);
      return res.status(200).json({ status: 'success', data: review });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}