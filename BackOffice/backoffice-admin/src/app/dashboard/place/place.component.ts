import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { getBackendUrl } from '../../config/api.config';
import { PlaceDialogComponent } from './place-dialog.component';

interface Place {
  _id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  coverImageUrl?: string;
  imageUrls?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PlacesResponse {
  success: boolean;
  data: Place[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

@Component({
  selector: 'app-place',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule
  ],
  template: `
    <div class="place-container">
      <div class="header">
        <h2>Gestión de Lugares Turísticos</h2>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Agregar Lugar
        </button>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Buscar</mat-label>
          <input matInput [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Buscar lugares...">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select [(ngModel)]="selectedCategory" (selectionChange)="applyFilter()">
            <mat-option value="">Todas las categorías</mat-option>
            <mat-option value="natural">Natural</mat-option>
            <mat-option value="cultural">Cultural</mat-option>
            <mat-option value="gastronomico">Gastronómico</mat-option>
            <mat-option value="recreativo">Recreativo</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [(ngModel)]="selectedStatus" (selectionChange)="applyFilter()">
            <mat-option value="">Todos los estados</mat-option>
            <mat-option value="true">Activo</mat-option>
            <mat-option value="false">Inactivo</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="places" matSort (matSortChange)="sortData($event)">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Nombre </th>
            <td mat-cell *matCellDef="let place"> {{place.name}} </td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Categoría </th>
            <td mat-cell *matCellDef="let place"> {{place.category}} </td>
          </ng-container>

          <ng-container matColumnDef="location">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Ubicación </th>
            <td mat-cell *matCellDef="let place"> {{place.location}} </td>
          </ng-container>

          <ng-container matColumnDef="active">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Estado </th>
            <td mat-cell *matCellDef="let place">
              <span [class]="place.active ? 'status-active' : 'status-inactive'">
                {{place.active ? 'Activo' : 'Inactivo'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Acciones </th>
            <td mat-cell *matCellDef="let place">
              <button mat-icon-button (click)="editPlace(place)" matTooltip="Editar">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="toggleStatus(place)" [matTooltip]="place.active ? 'Desactivar' : 'Activar'">
                <mat-icon>{{place.active ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <button mat-icon-button (click)="deletePlace(place)" matTooltip="Eliminar">
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
          [pageSizeOptions]="[5, 10, 25, 50]"
          (page)="onPageChange($event)">
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .place-container {
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    .status-active {
      color: green;
      font-weight: bold;
    }
    .status-inactive {
      color: red;
      font-weight: bold;
    }
  `]
})
export class PlaceComponent implements OnInit {
  places: Place[] = [];
  displayedColumns: string[] = ['name', 'category', 'location', 'active', 'actions'];
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPlaces();
  }

  loadPlaces(): void {
    const params = {
      page: (this.currentPage + 1).toString(),
      limit: this.pageSize.toString(),
      search: this.searchTerm,
      category: this.selectedCategory,
      active: this.selectedStatus
    };

    this.http.get<any>(getBackendUrl('/places'), { params }).subscribe({
      next: (response) => {
        if (response.success) {
          this.places = response.data;
          this.totalItems = response.pagination.total;
        }
      },
      error: (error) => {
        console.error('Error loading places:', error);
        this.snackBar.open('Error al cargar lugares', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openDialog(place?: Place): void {
    const dialogRef = this.dialog.open(PlaceDialogComponent, {
      width: '600px',
      data: place || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result._id) {
          this.updatePlace(result);
        } else {
          this.createPlace(result);
        }
      }
    });
  }

  createPlace(placeData: any): void {
    this.http.post(getBackendUrl('/places'), placeData).subscribe({
      next: (response) => {
        this.snackBar.open('Lugar creado exitosamente', 'Cerrar', { duration: 3000 });
        this.loadPlaces();
      },
      error: (error) => {
        console.error('Error creating place:', error);
        this.snackBar.open('Error al crear lugar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  updatePlace(placeData: any): void {
    this.http.put(getBackendUrl(`/places/${placeData._id}`), placeData).subscribe({
      next: (response) => {
        this.snackBar.open('Lugar actualizado exitosamente', 'Cerrar', { duration: 3000 });
        this.loadPlaces();
      },
      error: (error) => {
        console.error('Error updating place:', error);
        this.snackBar.open('Error al actualizar lugar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  toggleStatus(place: Place): void {
    const newStatus = !place.active;
    this.http.patch(getBackendUrl(`/places/${place._id}/status`), { active: newStatus }).subscribe({
      next: (response) => {
        this.snackBar.open(`Lugar ${newStatus ? 'activado' : 'desactivado'} exitosamente`, 'Cerrar', { duration: 3000 });
        this.loadPlaces();
      },
      error: (error) => {
        console.error('Error toggling place status:', error);
        this.snackBar.open('Error al cambiar estado del lugar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deletePlace(place: Place): void {
    if (confirm(`¿Estás seguro de que quieres eliminar "${place.name}"?`)) {
      this.http.delete(getBackendUrl(`/places/${place._id}`)).subscribe({
        next: (response) => {
          this.snackBar.open('Lugar eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.loadPlaces();
        },
        error: (error) => {
          console.error('Error deleting place:', error);
          this.snackBar.open('Error al eliminar lugar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  editPlace(place: Place): void {
    this.openDialog(place);
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.loadPlaces();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPlaces();
  }

  sortData(sort: Sort): void {
    // Implementar ordenamiento si es necesario
    this.loadPlaces();
  }
} 