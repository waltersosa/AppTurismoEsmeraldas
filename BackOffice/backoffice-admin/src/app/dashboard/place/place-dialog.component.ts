import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getBackendUrl } from '../../config/api.config';

interface Place {
  _id?: string;
  name: string;
  description: string;
  location: string;
  category: string;
  coverImageUrl?: string;
  imageUrls?: string[];
  active?: boolean;
}

@Component({
  selector: 'app-place-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        {{ data._id ? 'Editar Lugar Turístico' : 'Agregar Lugar Turístico' }}
      </h2>
      
      <form #placeForm="ngForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Nombre del Lugar</mat-label>
              <input matInput [(ngModel)]="place.name" name="name" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Ubicación</mat-label>
              <input matInput [(ngModel)]="place.location" name="location" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Categoría</mat-label>
              <mat-select [(ngModel)]="place.category" name="category" required>
                <mat-option value="natural">Natural</mat-option>
                <mat-option value="cultural">Cultural</mat-option>
                <mat-option value="gastronomico">Gastronómico</mat-option>
                <mat-option value="recreativo">Recreativo</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Descripción</mat-label>
              <textarea matInput [(ngModel)]="place.description" name="description" 
                        rows="4" required></textarea>
            </mat-form-field>

            <div class="image-section">
              <h3>Imágenes</h3>
              
              <div class="cover-image">
                <label>URL de Imagen de Portada</label>
                <input type="url" [(ngModel)]="place.coverImageUrl" name="coverImageUrl" 
                       placeholder="https://ejemplo.com/imagen.jpg" class="url-input">
                <div *ngIf="place.coverImageUrl" class="image-preview">
                  <img [src]="place.coverImageUrl" alt="Portada" (error)="onImageError($event)">
                  <button type="button" mat-icon-button (click)="removeCoverImage()">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>

              <div class="gallery-images">
                <label>URLs de Galería de Imágenes</label>
                <div class="url-inputs">
                  <div *ngFor="let url of place.imageUrls; let i = index" class="url-input-row">
                    <input type="url" [(ngModel)]="place.imageUrls[i]" 
                           [name]="'imageUrl' + i" 
                           placeholder="https://ejemplo.com/imagen.jpg" class="url-input">
                    <button type="button" mat-icon-button (click)="removeGalleryImage(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <button type="button" mat-button (click)="addImageUrl()" class="add-url-btn">
                    <mat-icon>add</mat-icon>
                    Agregar URL de imagen
                  </button>
                </div>
                <div *ngIf="place.imageUrls && place.imageUrls.length > 0" class="gallery-preview">
                  <div *ngFor="let image of place.imageUrls; let i = index" class="image-item">
                    <img [src]="image" [alt]="'Imagen ' + (i + 1)" (error)="onImageError($event)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="!placeForm.valid || isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (data._id ? 'Actualizar' : 'Crear') }}
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      max-width: 600px;
    }
    .form-grid {
      display: grid;
      gap: 16px;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .image-section {
      grid-column: 1 / -1;
      margin-top: 16px;
    }
    .image-section h3 {
      margin-bottom: 12px;
      color: #333;
    }
    .cover-image, .gallery-images {
      margin-bottom: 20px;
    }
    .cover-image label, .gallery-images label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    .url-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #f9f9f9;
      margin-bottom: 8px;
    }
    .url-inputs {
      margin-bottom: 12px;
    }
    .url-input-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 8px;
    }
    .url-input-row .url-input {
      flex: 1;
      margin-bottom: 0;
    }
    .add-url-btn {
      margin-top: 8px;
    }
    .image-preview, .gallery-preview {
      margin-top: 12px;
    }
    .image-preview img {
      max-width: 200px;
      max-height: 150px;
      border-radius: 8px;
      border: 2px solid #ddd;
    }
    .gallery-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }
    .image-item {
      position: relative;
      display: inline-block;
    }
    .image-item img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid #ddd;
    }
    .image-preview {
      position: relative;
      display: inline-block;
    }
    .image-preview button {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #f44336;
      color: white;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      min-width: 24px;
      padding: 0;
    }
  `]
})
export class PlaceDialogComponent {
  place: Place = {
    name: '',
    description: '',
    location: '',
    category: '',
    imageUrls: []
  };
  isSubmitting = false;

  constructor(
    private dialogRef: MatDialogRef<PlaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Place,
    private snackBar: MatSnackBar
  ) {
    if (data._id) {
      this.place = { ...data };
    }
  }

  addImageUrl(): void {
    if (!this.place.imageUrls) {
      this.place.imageUrls = [];
    }
    this.place.imageUrls.push('');
  }

  removeCoverImage(): void {
    this.place.coverImageUrl = undefined;
  }

  removeGalleryImage(index: number): void {
    if (this.place.imageUrls) {
      this.place.imageUrls.splice(index, 1);
    }
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  onSubmit(): void {
    if (!this.place.name || !this.place.description || !this.place.location || !this.place.category) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    // Filtrar URLs vacías
    if (this.place.imageUrls) {
      this.place.imageUrls = this.place.imageUrls.filter(url => url && url.trim() !== '');
    }

    this.isSubmitting = true;
    const placeData = { ...this.place };
    
    // Solo remover _id si es un lugar nuevo (no tiene _id)
    if (!this.data._id) {
      delete placeData._id;
    }

    this.dialogRef.close(placeData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 