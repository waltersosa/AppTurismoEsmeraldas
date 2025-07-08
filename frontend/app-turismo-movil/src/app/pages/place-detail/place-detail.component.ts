import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlacesService, Place } from '../../services/places.service';
import { ReviewsService, Review } from '../../services/reviews.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './place-detail.component.html',
  styleUrl: './place-detail.component.scss'
})
export class PlaceDetailComponent implements OnInit {
  place: Place | null = null;
  loading = true;
  error = false;

  reviews: Review[] = [];
  reviewsLoading = true;
  reviewsError = false;

  reviewForm: FormGroup;
  reviewSubmitting = false;
  reviewSubmitError = '';

  averageRating: number = 0;
  starCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private reviewsService: ReviewsService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      userName: ['', [Validators.required, Validators.maxLength(40)]],
      comment: ['', [Validators.required, Validators.maxLength(300)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.error = false;
      this.placesService.getPlaceById(id).subscribe({
        next: (response) => {
          this.place = response.data;
          this.loading = false;
          this.loadReviews();
        },
        error: (err) => {
          this.error = true;
          this.loading = false;
        }
      });
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  loadReviews() {
    if (!this.place) return;
    this.reviewsLoading = true;
    this.reviewsError = false;
    this.reviewsService.getReviewsByPlace(this.place._id).subscribe({
      next: (response) => {
        this.reviews = response.data;
        this.calculateRatings();
        this.reviewsLoading = false;
      },
      error: () => {
        this.reviewsError = true;
        this.reviewsLoading = false;
      }
    });
  }

  calculateRatings() {
    if (!this.reviews.length) {
      this.averageRating = 0;
      this.starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      return;
    }
    let total = 0;
    this.starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const review of this.reviews) {
      total += review.rating;
      this.starCounts[review.rating] = (this.starCounts[review.rating] || 0) + 1;
    }
    this.averageRating = total / this.reviews.length;
  }

  getStarPercent(star: number): number {
    if (!this.reviews.length) return 0;
    return (this.starCounts[star] / this.reviews.length) * 100;
  }

  submitReview() {
    if (!this.place || this.reviewForm.invalid) return;
    this.reviewSubmitting = true;
    this.reviewSubmitError = '';
    const review: Partial<Review> = {
      placeId: this.place._id,
      userName: this.reviewForm.value.userName,
      comment: this.reviewForm.value.comment,
      rating: this.reviewForm.value.rating
    };
    this.reviewsService.addReview(review).subscribe({
      next: () => {
        this.reviewForm.reset({ userName: '', comment: '', rating: 5 });
        this.reviewSubmitting = false;
        this.loadReviews();
      },
      error: (err) => {
        this.reviewSubmitError = 'No se pudo enviar la reseña. Intenta nuevamente.';
        this.reviewSubmitting = false;
      }
    });
  }
}
