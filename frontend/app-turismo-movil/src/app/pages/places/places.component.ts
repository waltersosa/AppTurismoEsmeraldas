import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PlacesService, Place } from '../../services/places.service';
import { MenuInferiorComponent } from '../menu-inferior/menu-inferior.component';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuInferiorComponent],
  templateUrl: './places.component.html',
  styleUrl: './places.component.scss'
})
export class PlacesComponent implements OnInit {
  showComingSoon = false;
  places: Place[] = [];
  loading = true;
  error = false;
  selectedCategory = '';

  // Categorías disponibles en el microservicio de places
  categories = [
    { id: '', name: 'Todos', icon: '🏠' },
    { id: 'playa', name: 'Playas', icon: '🏖️' },
    { id: 'rio', name: 'Ríos', icon: '🌊' },
    { id: 'cascada', name: 'Cascadas', icon: '💧' },
    { id: 'reserva', name: 'Reservas', icon: '🌿' },
    { id: 'montaña', name: 'Montañas', icon: '⛰️' },
    { id: 'bosque', name: 'Bosques', icon: '🌲' },
    { id: 'museo', name: 'Museos', icon: '🏛️' },
    { id: 'iglesia', name: 'Iglesias', icon: '⛪' },
    { id: 'parque', name: 'Parques', icon: '🌳' },
    { id: 'mirador', name: 'Miradores', icon: '👁️' },
    { id: 'gastronomía', name: 'Gastronomía', icon: '🍽️' }
  ];

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.loadPlaces();
  }

  loadPlaces() {
    this.loading = true;
    this.error = false;
    
    this.placesService.getActivePlaces().subscribe({
      next: (response) => {
        this.places = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando lugares:', error);
        this.error = true;
        this.loading = false;
        // Cargar datos de ejemplo si hay error
        this.loadSampleData();
      }
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.loading = true;
    
    if (category === '') {
      this.loadPlaces();
    } else {
      this.placesService.getPlacesByCategory(category).subscribe({
        next: (response) => {
          this.places = response.data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtrando lugares:', error);
          this.loading = false;
        }
      });
    }
  }

  loadSampleData() {
    // Datos de ejemplo si el microservicio no está disponible
    this.places = [
      {
        _id: '1',
        name: 'Playa de las Palmas',
        description: 'Arena dorada y aguas cristalinas',
        category: 'playa',
        location: 'Atacames, Esmeraldas',
        imageUrls: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'],
        coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Río Esmeraldas',
        description: 'Navegación y pesca deportiva',
        category: 'rio',
        location: 'Esmeraldas, Ecuador',
        imageUrls: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'],
        coverImageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: 'Reserva Ecológica Mache-Chindul',
        description: 'Biodiversidad y senderismo',
        category: 'reserva',
        location: 'Mache, Esmeraldas',
        imageUrls: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'],
        coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '4',
        name: 'Cascada El Salto',
        description: 'Aguas refrescantes y naturaleza',
        category: 'cascada',
        location: 'San Lorenzo, Esmeraldas',
        imageUrls: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'],
        coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  getCategoryDisplayName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'playa': 'Playa',
      'rio': 'Río',
      'reserva': 'Reserva',
      'cascada': 'Cascada',
      'montaña': 'Montaña',
      'bosque': 'Bosque',
      'museo': 'Museo',
      'iglesia': 'Iglesia',
      'parque': 'Parque',
      'mirador': 'Mirador',
      'gastronomía': 'Gastronomía'
    };
    return categoryMap[category] || category;
  }

  getCategoryIcon(category: string): string {
    const foundCategory = this.categories.find(c => c.id === category);
    return foundCategory?.icon || '📍';
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  showComingSoonMsg() {
    this.showComingSoon = true;
    setTimeout(() => {
      this.showComingSoon = false;
    }, 1800);
  }
}
