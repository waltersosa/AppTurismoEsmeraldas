import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getBackendUrl } from '../../config/api.config';

interface Review {
  _id: string;
  lugarId: string;
  usuarioId: string;
  comentario: string;
  calificacion: number;
  estado: string;
  fecha: string;
  lugar?: {
    name: string;
  };
  usuario?: {
    nombre: string;
  };
}

interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatTooltipModule
  ],
  template: `
    <div class="review-container">
      <div class="header">
        <h2>Gestión de Reseñas</h2>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Lugar</mat-label>
          <mat-select [(ngModel)]="selectedPlace" (selectionChange)="applyFilter()">
            <mat-option value="">Todos los lugares</mat-option>
            <mat-option *ngFor="let place of places" [value]="place._id">
              {{place.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilter()">
            <mat-option value="">Todos los estados</mat-option>
            <mat-option value="activo">Activo</mat-option>
            <mat-option value="pendiente">Pendiente</mat-option>
            <mat-option value="rechazado">Rechazado</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Calificación</mat-label>
          <mat-select [(ngModel)]="selectedRating" (selectionChange)="applyFilter()">
            <mat-option value="">Todas las calificaciones</mat-option>
            <mat-option value="5">5 estrellas</mat-option>
            <mat-option value="4">4 estrellas</mat-option>
            <mat-option value="3">3 estrellas</mat-option>
            <mat-option value="2">2 estrellas</mat-option>
            <mat-option value="1">1 estrella</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="reviews">
          <ng-container matColumnDef="lugar">
            <th mat-header-cell *matHeaderCellDef> Lugar </th>
            <td mat-cell *matCellDef="let review"> {{review.lugar?.name || 'N/A'}} </td>
          </ng-container>

          <ng-container matColumnDef="usuario">
            <th mat-header-cell *matHeaderCellDef> Usuario </th>
            <td mat-cell *matCellDef="let review"> {{review.usuario?.nombre || 'Anónimo'}} </td>
          </ng-container>

          <ng-container matColumnDef="calificacion">
            <th mat-header-cell *matHeaderCellDef> Calificación </th>
            <td mat-cell *matCellDef="let review">
              <span class="rating">
                <span *ngFor="let star of [1,2,3,4,5]" 
                      [class]="star <= review.calificacion ? 'star-filled' : 'star-empty'">
                  ★
                </span>
                ({{review.calificacion}})
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="comentario">
            <th mat-header-cell *matHeaderCellDef> Comentario </th>
            <td mat-cell *matCellDef="let review"> 
              <div class="comment">{{review.comentario}}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef> Estado </th>
            <td mat-cell *matCellDef="let review">
              <span [class]="'status-' + review.estado">
                {{getStatusText(review.estado)}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef> Fecha </th>
            <td mat-cell *matCellDef="let review"> {{formatDate(review.fecha)}} </td>
          </ng-container>

          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef> Acciones </th>
            <td mat-cell *matCellDef="let review">
              <button mat-icon-button (click)="approveReview(review)" 
                      *ngIf="review.estado === 'pendiente'"
                      matTooltip="Aprobar">
                <mat-icon>check</mat-icon>
              </button>
              <button mat-icon-button (click)="rejectReview(review)" 
                      *ngIf="review.estado === 'pendiente'"
                      matTooltip="Rechazar">
                <mat-icon>close</mat-icon>
              </button>
              <button mat-icon-button (click)="deleteReview(review)" 
                      matTooltip="Eliminar">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator 
          [length]="totalItems"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .review-container {
      padding: 20px;
    }
    .header {
      margin-bottom: 20px;
    }
    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }
    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .star-filled {
      color: #ffd700;
    }
    .star-empty {
      color: #ddd;
    }
    .comment {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .status-activo {
      color: green;
      font-weight: bold;
    }
    .status-pendiente {
      color: orange;
      font-weight: bold;
    }
    .status-rechazado {
      color: red;
      font-weight: bold;
    }
  `]
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  places: any[] = [];
  displayedColumns: string[] = ['lugar', 'usuario', 'calificacion', 'comentario', 'estado', 'fecha', 'acciones'];
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  selectedPlace = '';
  selectedStatus = '';
  selectedRating = '';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPlaces();
    this.loadReviews();
  }

  loadPlaces(): void {
    this.http.get<any>(getBackendUrl('/places')).subscribe(res => {
      if (res.success) {
        this.places = res.data || [];
      }
    });
  }

  loadReviews(): void {
    const params: any = {
      page: (this.currentPage + 1).toString(),
      limit: this.pageSize.toString()
    };

    if (this.selectedPlace) params.lugarId = this.selectedPlace;
    if (this.selectedStatus) params.estado = this.selectedStatus;
    if (this.selectedRating) params.calificacion = this.selectedRating;

    this.http.get<any>(getBackendUrl('/reviews/admin'), { params }).subscribe(res => {
      if (res.success) {
        this.reviews = res.data || [];
        this.totalItems = res.pagination?.total || 0;
      }
    });
  }

  approveReview(resena: Review): void {
    this.http.put(getBackendUrl(`/reviews/admin/${resena._id}`), { estado: 'activo' }).subscribe({
      next: (response) => {
        this.snackBar.open('Reseña aprobada exitosamente', 'Cerrar', { duration: 3000 });
        this.loadReviews();
      },
      error: (error) => {
        console.error('Error approving review:', error);
        this.snackBar.open('Error al aprobar reseña', 'Cerrar', { duration: 3000 });
      }
    });
  }

  rejectReview(resena: Review): void {
    this.http.put(getBackendUrl(`/reviews/admin/${resena._id}`), { estado: 'rechazado' }).subscribe({
      next: (response) => {
        this.snackBar.open('Reseña rechazada exitosamente', 'Cerrar', { duration: 3000 });
        this.loadReviews();
      },
      error: (error) => {
        console.error('Error rejecting review:', error);
        this.snackBar.open('Error al rechazar reseña', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteReview(resena: Review): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.http.delete(getBackendUrl(`/reviews/${resena._id}`)).subscribe({
        next: (response) => {
          this.snackBar.open('Reseña eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.loadReviews();
        },
        error: (error) => {
          console.error('Error deleting review:', error);
          this.snackBar.open('Error al eliminar reseña', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.loadReviews();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReviews();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'activo': 'Aprobado',
      'pendiente': 'Pendiente',
      'rechazado': 'Rechazado'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES');
  }
} 