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
import { HttpClient } from '@angular/common/http';
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
                <label>Imagen de Portada</label>
                <input type="file" (change)="onCoverImageSelected($event)" 
                       accept="image/*" #coverImageInput>
                <div *ngIf="place.coverImageUrl" class="image-preview">
                  <img [src]="place.coverImageUrl" alt="Portada">
                  <button type="button" mat-icon-button (click)="removeCoverImage()">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>

              <div class="gallery-images">
                <label>Galería de Imágenes</label>
                <input type="file" (change)="onGalleryImagesSelected($event)" 
                       accept="image/*" multiple #galleryImagesInput>
                <div *ngIf="place.imageUrls && place.imageUrls.length > 0" class="gallery-preview">
                  <div *ngFor="let image of place.imageUrls; let i = index" class="image-item">
                    <img [src]="image" [alt]="'Imagen ' + (i + 1)">
                    <button type="button" mat-icon-button (click)="removeGalleryImage(i)">
                      <mat-icon>close</mat-icon>
                    </button>
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
    input[type="file"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #f9f9f9;
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
    .image-item button {
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
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    if (data._id) {
      this.place = { ...data };
    }
  }

  onCoverImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file, 'cover');
    }
  }

  onGalleryImagesSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.uploadImage(files[i], 'gallery');
      }
    }
  }

  uploadImage(file: File, type: 'cover' | 'gallery'): void {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('placeId', this.place._id || 'temp');
    formData.append('type', type);

    this.http.post(getBackendUrl('/media/upload'), formData).subscribe({
      next: (response: any) => {
        if (response.success && response.files && response.files.length > 0) {
          const imageUrl = response.files[0].url;
          
          if (type === 'cover') {
            this.place.coverImageUrl = imageUrl;
          } else {
            if (!this.place.imageUrls) {
              this.place.imageUrls = [];
            }
            this.place.imageUrls.push(imageUrl);
          }
          
          this.snackBar.open('Imagen subida exitosamente', 'Cerrar', { duration: 2000 });
        }
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.snackBar.open('Error al subir imagen', 'Cerrar', { duration: 3000 });
      }
    });
  }

  removeCoverImage(): void {
    this.place.coverImageUrl = undefined;
  }

  removeGalleryImage(index: number): void {
    if (this.place.imageUrls) {
      this.place.imageUrls.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (!this.place.name || !this.place.description || !this.place.location || !this.place.category) {
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;
    const placeData = { ...this.place };
    delete placeData._id; // Remover _id para el envío

    if (this.data._id) {
      // Actualizar lugar existente
      this.http.put(getBackendUrl(`/places/${this.data._id}`), placeData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.snackBar.open('Lugar actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close({ ...placeData, _id: this.data._id });
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating place:', error);
          this.snackBar.open('Error al actualizar lugar', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      // Crear nuevo lugar
      this.http.post(getBackendUrl('/places'), placeData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.snackBar.open('Lugar creado exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error creating place:', error);
          this.snackBar.open('Error al crear lugar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 