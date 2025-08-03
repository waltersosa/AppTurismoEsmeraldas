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

  user: any = null;
  editReviewId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private reviewsService: ReviewsService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, this.maxWordsValidator(50)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }
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
    let count = 0;
    for (const review of this.reviews) {
      if (typeof review.calificacion === 'number') {
        total += review.calificacion;
        this.starCounts[review.calificacion] = (this.starCounts[review.calificacion] || 0) + 1;
        count++;
      }
    }
    this.averageRating = count ? total / count : 0;
  }

  getStarPercent(star: number): number {
    if (!this.reviews.length) return 0;
    return (this.starCounts[star] / this.reviews.length) * 100;
  }

  isMyReview(review: Review): boolean {
    const myId = this.user?._id || this.user?.id;
    if (!myId) return false;
    if (typeof review.usuarioId === 'object' && review.usuarioId?._id) {
      return review.usuarioId._id === myId;
    }
    return review.usuarioId === myId;
  }

  startEditReview(review: Review) {
    this.editReviewId = review._id || null;
    this.reviewForm.setValue({
      comment: review.comentario,
      rating: review.calificacion || 5
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteReview(review: Review) {
    if (!review._id) return;
    if (!confirm('¿Seguro que deseas eliminar esta reseña?')) return;
    this.reviewSubmitting = true;
    this.reviewsService.deleteReview(review._id).subscribe({
      next: () => {
        this.reviewSubmitting = false;
        this.loadReviews();
      },
      error: () => {
        this.reviewSubmitError = 'No se pudo eliminar la reseña.';
        this.reviewSubmitting = false;
      }
    });
  }

  submitReview() {
    if (!this.place || this.reviewForm.invalid) return;
    this.reviewSubmitting = true;
    this.reviewSubmitError = '';
    const review = {
      lugarId: this.place._id,
      comentario: this.reviewForm.value.comment,
      calificacion: this.reviewForm.value.rating,
      userName: this.user?.nombre || this.user?.name || ''
    };
    if (this.editReviewId) {
      this.reviewsService.updateReview(this.editReviewId, review).subscribe({
        next: () => {
          this.reviewForm.reset({ comment: '', rating: 5 });
          this.editReviewId = null;
          this.reviewSubmitting = false;
          this.loadReviews();
        },
        error: (err) => {
          this.reviewSubmitError = err?.error?.message || 'No se pudo actualizar la reseña.';
          this.reviewSubmitting = false;
        }
      });
    } else {
      this.reviewsService.addReview(review).subscribe({
        next: () => {
          this.reviewForm.reset({ comment: '', rating: 5 });
          this.reviewSubmitting = false;
          this.loadReviews();
        },
        error: (err) => {
          this.reviewSubmitError = err?.error?.message || 'No se pudo enviar la reseña. Intenta nuevamente.';
          this.reviewSubmitting = false;
        }
      });
    }
  }

  showAlert(msg: string) {
    window.alert(msg);
  }

  maxWordsValidator(max: number) {
    return (control: any) => {
      if (!control.value) return null;
      const words = control.value.trim().split(/\s+/);
      return words.length > max ? { maxwords: { max, actual: words.length } } : null;
    };
  }

  getReviewUserName(review: Review): string {
    console.log('REVIEW RECIBIDA:', review);
    if (review.userName) return review.userName;
    if (review.usuario && typeof review.usuario === 'object' && 'nombre' in review.usuario) {
      return review.usuario.nombre || '';
    }
    if (review.usuarioId && typeof review.usuarioId === 'object' && 'nombre' in review.usuarioId) {
      return (review.usuarioId as any).nombre || '';
    }
    return typeof review.usuarioId === 'string' ? review.usuarioId : '';
  }
}
