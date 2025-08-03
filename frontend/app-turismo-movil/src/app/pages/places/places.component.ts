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
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBIffodA8VrK3pN-TJ14VyEkya_5wyLWhFjSviAxZ3fe81UIIOiO0Z3SXvSv_tsIgxf4eqvTBpLcd9XRzEM-5tC_ktGbBZK917RJRFw4qn88_OLf6gQHs5UM8oFyWV1fcYeya5dHUaK2CLifQKy3JIF6OdOqT2aUvKpV4r_A3v1dsMp2fTR54L__5NTLvR6X04su7IJyB1t_btoG7x41jEFgFy4SClXJnFBd29Ma25GxBP-piaLOkaRc06nEsckFF0gPtErXKFyPSk4'],
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIffodA8VrK3pN-TJ14VyEkya_5wyLWhFjSviAxZ3fe81UIIOiO0Z3SXvSv_tsIgxf4eqvTBpLcd9XRzEM-5tC_ktGbBZK917RJRFw4qn88_OLf6gQHs5UM8oFyWV1fcYeya5dHUaK2CLifQKy3JIF6OdOqT2aUvKpV4r_A3v1dsMp2fTR54L__5NTLvR6X04su7IJyB1t_btoG7x41jEFgFy4SClXJnFBd29Ma25GxBP-piaLOkaRc06nEsckFF0gPtErXKFyPSk4',
        active: true,
        ownerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Río Esmeraldas',
        description: 'Navegación y pesca deportiva',
        category: 'rio',
        location: 'Esmeraldas, Ecuador',
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuByKRx5dRY8Dr1GFJcFqd0CWiPzkNUcl_m4LOiHLfUT--6DGaug5IN-FIUk8SP_8Yd9OMy0sBXy1loqPZdg1dhUNNQS0rxGEva5w0lMuvO5c01gdxE__OCfi_rB59X5_aEAABRqZTIRsRAH70pVDiO1nqSmtueGt6CXqxMhG5ETeXK82XunmRMGbvMK9zAdU_0jcOCtKhk6vjLIyrxyOibWfEaPe0J651_7gI5hiS9TVKNM2jtyXv3ATTNzgujVXYiM41eNhO2xNphj'],
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByKRx5dRY8Dr1GFJcFqd0CWiPzkNUcl_m4LOiHLfUT--6DGaug5IN-FIUk8SP_8Yd9OMy0sBXy1loqPZdg1dhUNNQS0rxGEva5w0lMuvO5c01gdxE__OCfi_rB59X5_aEAABRqZTIRsRAH70pVDiO1nqSmtueGt6CXqxMhG5ETeXK82XunmRMGbvMK9zAdU_0jcOCtKhk6vjLIyrxyOibWfEaPe0J651_7gI5hiS9TVKNM2jtyXv3ATTNzgujVXYiM41eNhO2xNphj',
        active: true,
        ownerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: 'Reserva Ecológica Mache-Chindul',
        description: 'Biodiversidad y senderismo',
        category: 'reserva',
        location: 'Mache, Esmeraldas',
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD5WVx9TYaH5JrHM4r_Tzknj7dua8vpQvjXg6oR7UXiFQzHEQLfTB88alL03YLTdi1EJf6FFZ_ke5rmlkYxk2g_ctEkPzpXkeCI7T21Q8PwuOTVi_KTFSt9UV98QRIFKk6KgssEEH2R-18N_jQq7sc5vqj__m8qXLIFh6xPyOR25dyuZjc4dseP-wuH4FGn0aeizJXWKiRFWSFQb3ZhU0A54d0E3JOeDnjl9kzkmuq7IWQdANuK5kRmg5bpHVyECsO2OKgKy9oOQRyw'],
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5WVx9TYaH5JrHM4r_Tzknj7dua8vpQvjXg6oR7UXiFQzHEQLfTB88alL03YLTdi1EJf6FFZ_ke5rmlkYxk2g_ctEkPzpXkeCI7T21Q8PwuOTVi_KTFSt9UV98QRIFKk6KgssEEH2R-18N_jQq7sc5vqj__m8qXLIFh6xPyOR25dyuZjc4dseP-wuH4FGn0aeizJXWKiRFWSFQb3ZhU0A54d0E3JOeDnjl9kzkmuq7IWQdANuK5kRmg5bpHVyECsO2OKgKy9oOQRyw',
        active: true,
        ownerId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '4',
        name: 'Cascada El Salto',
        description: 'Aguas refrescantes y naturaleza',
        category: 'cascada',
        location: 'San Lorenzo, Esmeraldas',
        images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuB4gig9oiXqNsojpIZYBabs3iyUsS5e5X4-_9bxxi5UZB9Iq7zppECj54kUPpE7N4OTMQRfyQpvd0J8A6sjnz_WWrlbd-LLdhQ86FMqBkhkMG_0UpnAAITI3ixG1sn44lZUKlVOf59h_hF2hUU_rBbCnvGKPcnvR9lWhg1L6XUesnoJtObVIsBcSewX2CmRTi7roa4DhJKdDqJgW-3u78MLrTWWJE4RPk0hZbwYgoR6R9PI6xPM_JzBkNdjT-2MPJ95PuZN0ccz-vjA'],
        coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4gig9oiXqNsojpIZYBabs3iyUsS5e5X4-_9bxxi5UZB9Iq7zppECj54kUPpE7N4OTMQRfyQpvd0J8A6sjnz_WWrlbd-LLdhQ86FMqBkhkMG_0UpnAAITI3ixG1sn44lZUKlVOf59h_hF2hUU_rBbCnvGKPcnvR9lWhg1L6XUesnoJtObVIsBcSewX2CmRTi7roa4DhJKdDqJgW-3u78MLrTWWJE4RPk0hZbwYgoR6R9PI6xPM_JzBkNdjT-2MPJ95PuZN0ccz-vjA',
        active: true,
        ownerId: '1',
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
