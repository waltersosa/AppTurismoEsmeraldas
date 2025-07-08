import axios from 'axios';

const BASE_URL = 'http://localhost:3002/places';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZhZjExOTMwYzI5NzM2Mzc1ODU1MzMiLCJyb2wiOiJnYWQiLCJpYXQiOjE3NTE5NDIzNzIsImV4cCI6MTc1MTk0OTU3Mn0.Y6UD4QEeVu4jgYNs2x42OPuKwUrpjN8uD9wYpQ2emc8'; // Reemplaza por un token válido de usuario GAD

const places = [
  // Playas
  {
    name: 'Playa de Atacames',
    description: 'Una de las playas más famosas de Ecuador, conocida por su arena clara y ambiente festivo.',
    category: 'playa',
    location: 'Atacames, Esmeraldas',
    images: ['https://scontent.fuio1-2.fna.fbcdn.net/v/t39.30808-6/490914646_601768942869926_25551901185702826_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFHCPY13A3odC5AxWYq7QyBWpyFwYrwpe9anIXBivCl706SNzp9J5qorWeb02t5wsDZZlDbycoINmdKGvLoR0eM&_nc_ohc=M_4fFI4iVJIQ7kNvwG3B5GW&_nc_oc=Adkx4Xr9gbZnPW3twTlNESCvHhrGjjbO4pFuiLG-URdKyqFxnoH415TDqZ1W0NM1kWmIWLuoLbQQqz-PtEnGdzSO&_nc_zt=23&_nc_ht=scontent.fuio1-2.fna&_nc_gid=jmaElPzbk8nCmhWYHMOq_Q&oh=00_AfRuHRgphckzReH1W96-T0dA_Gg7GfeQ88CD_CnLSnFQ2w&oe=68724ACE'],
    coverImage: 'https://scontent.fuio1-2.fna.fbcdn.net/v/t39.30808-6/490914646_601768942869926_25551901185702826_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFHCPY13A3odC5AxWYq7QyBWpyFwYrwpe9anIXBivCl706SNzp9J5qorWeb02t5wsDZZlDbycoINmdKGvLoR0eM&_nc_ohc=M_4fFI4iVJIQ7kNvwG3B5GW&_nc_oc=Adkx4Xr9gbZnPW3twTlNESCvHhrGjjbO4pFuiLG-URdKyqFxnoH415TDqZ1W0NM1kWmIWLuoLbQQqz-PtEnGdzSO&_nc_zt=23&_nc_ht=scontent.fuio1-2.fna&_nc_gid=jmaElPzbk8nCmhWYHMOq_Q&oh=00_AfRuHRgphckzReH1W96-T0dA_Gg7GfeQ88CD_CnLSnFQ2w&oe=68724ACE'
  },
  {
    name: 'Playa Tonsupa',
    description: 'Playa tranquila ideal para familias, con aguas cálidas y hoteles frente al mar.',
    category: 'playa',
    location: 'Tonsupa, Esmeraldas',
    images: ['https://lbcdn.airpaz.com/cdn-cgi/image/w=530,h=390,f=webp/hotelimages/3584915/tonsupa-diamond-beach-tonsupa-759d97045939de1339241f55c238c2df.jpg'],
    coverImage: 'https://lbcdn.airpaz.com/cdn-cgi/image/w=530,h=390,f=webp/hotelimages/3584915/tonsupa-diamond-beach-tonsupa-759d97045939de1339241f55c238c2df.jpg'
  },
  // Ríos
  {
    name: 'Río Esmeraldas',
    description: 'Río principal de la provincia, ideal para paseos en lancha y pesca deportiva.',
    category: 'rio',
    location: 'Esmeraldas, Ecuador',
    images: ['https://scontent.fuio1-1.fna.fbcdn.net/v/t39.30808-6/465011036_10160830996106872_4259963598917434607_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cf85f3&_nc_eui2=AeHAH0VCYzZJP4D80so8PAaBY5DIcfLkGQRjkMhx8uQZBCP7hEEqCSAzWkCSV7ohIozqETrIRADEo5v-Vqt8oQtg&_nc_ohc=hvNpT8p8lvcQ7kNvwFHQCnV&_nc_oc=Adl9ZReRJU9zxwZiqc_MoF5SttgJzoG2wo3cPTAA4c0_PAa1j4GQzR3BJ3wDlWaCwRufrVmkDbd6zLqV2oBHetZH&_nc_zt=23&_nc_ht=scontent.fuio1-1.fna&_nc_gid=SOGKGD2UlRc4ZduQu-igOQ&oh=00_AfTOJT2vYFkxFySLgKYmVkbQQimUtZmx6rrtLI6KCwA_kA&oe=68725B88'],
    coverImage: 'https://scontent.fuio1-1.fna.fbcdn.net/v/t39.30808-6/465011036_10160830996106872_4259963598917434607_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=cf85f3&_nc_eui2=AeHAH0VCYzZJP4D80so8PAaBY5DIcfLkGQRjkMhx8uQZBCP7hEEqCSAzWkCSV7ohIozqETrIRADEo5v-Vqt8oQtg&_nc_ohc=hvNpT8p8lvcQ7kNvwFHQCnV&_nc_oc=Adl9ZReRJU9zxwZiqc_MoF5SttgJzoG2wo3cPTAA4c0_PAa1j4GQzR3BJ3wDlWaCwRufrVmkDbd6zLqV2oBHetZH&_nc_zt=23&_nc_ht=scontent.fuio1-1.fna&_nc_gid=SOGKGD2UlRc4ZduQu-igOQ&oh=00_AfTOJT2vYFkxFySLgKYmVkbQQimUtZmx6rrtLI6KCwA_kA&oe=68725B88'
  },
  {
    name: 'Río Santiago',
    description: 'Río rodeado de naturaleza y comunidades afroecuatorianas.',
    category: 'rio',
    location: 'San Lorenzo, Esmeraldas',
    images: ['https://imgs.mongabay.com/wp-content/uploads/sites/25/2025/01/13182044/13.-la-union-entre-dos-rios-zamora-y-namangoza.-500-metros-atras-la-costruccion-de-hidroelectrica-rio-santiago-2048x1152.jpg'],
    coverImage: 'https://imgs.mongabay.com/wp-content/uploads/sites/25/2025/01/13182044/13.-la-union-entre-dos-rios-zamora-y-namangoza.-500-metros-atras-la-costruccion-de-hidroelectrica-rio-santiago-2048x1152.jpg'
  },
  // Cascadas
  {
    name: 'Cascada El Salto',
    description: 'Hermosa cascada rodeada de vegetación, ideal para senderismo y fotografía.',
    category: 'cascada',
    location: 'San Mateo, Esmeraldas',
    images: ['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/9b/87/23/cascada-el-salto.jpg?w=1400&h=800&s=1'],
    coverImage: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/9b/87/23/cascada-el-salto.jpg?w=1400&h=800&s=1'
  },
  {
    name: 'Cascada Chuchubí',
    description: 'Cascada escondida en la selva, perfecta para los amantes de la aventura.',
    category: 'cascada',
    location: 'Muisne, Esmeraldas',
    images: ['https://scontent.fuio1-1.fna.fbcdn.net/v/t39.30808-6/481196742_9358018217616302_2031263964398661892_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH1xipksPS1dMVO5jGfEHlWVvi3nmRAzgFW-LeeZEDOAcMUlUcBeuFSVsq_zzkWFkgqqBeLFw1xWUVi_X3mmWqV&_nc_ohc=GuzX7_z2mvsQ7kNvwEb12MU&_nc_oc=AdlvUVvLntB4gYiS60a4NHuuY3kVfh8UIaBQE0yZXgZJ0v0LnFitK6nIHS_t3n3m3d1ubgS2TpwG60iFjvjUWwAZ&_nc_zt=23&_nc_ht=scontent.fuio1-1.fna&_nc_gid=Ezave6PHG8e_L-ObJB_mpA&oh=00_AfSkLjBGfenqaisbYsC3aLFzqq5ZUmZBRKXeYjNlWH537g&oe=687259C3'],
    coverImage: 'https://scontent.fuio1-1.fna.fbcdn.net/v/t39.30808-6/481196742_9358018217616302_2031263964398661892_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeH1xipksPS1dMVO5jGfEHlWVvi3nmRAzgFW-LeeZEDOAcMUlUcBeuFSVsq_zzkWFkgqqBeLFw1xWUVi_X3mmWqV&_nc_ohc=GuzX7_z2mvsQ7kNvwEb12MU&_nc_oc=AdlvUVvLntB4gYiS60a4NHuuY3kVfh8UIaBQE0yZXgZJ0v0LnFitK6nIHS_t3n3m3d1ubgS2TpwG60iFjvjUWwAZ&_nc_zt=23&_nc_ht=scontent.fuio1-1.fna&_nc_gid=Ezave6PHG8e_L-ObJB_mpA&oh=00_AfSkLjBGfenqaisbYsC3aLFzqq5ZUmZBRKXeYjNlWH537g&oe=687259C3'
  },
  // Reservas
  {
    name: 'Reserva Ecológica Mache-Chindul',
    description: 'Área protegida con gran biodiversidad, senderos y cascadas.',
    category: 'reserva',
    location: 'Mache, Esmeraldas',
    images: ['https://www.eluniverso.com/resizer/v2/7DH6QLXE4RHFFG5IBG6ASLRWBE.jpg?auth=095ebef1a7c45205fcd50f6147d17c2f24ea14def110338237d15847749167ac&width=456&height=336&quality=75&smart=true'],
    coverImage: 'https://www.eluniverso.com/resizer/v2/7DH6QLXE4RHFFG5IBG6ASLRWBE.jpg?auth=095ebef1a7c45205fcd50f6147d17c2f24ea14def110338237d15847749167ac&width=456&height=336&quality=75&smart=true'
  },
  {
    name: 'Reserva Cotacachi-Cayapas',
    description: 'Reserva natural con bosques húmedos y especies endémicas.',
    category: 'reserva',
    location: 'Limones, Esmeraldas',
    images: ['https://img.goraymi.com/2018/03/05/64b331287baeb314a463459ba689bca2_xl.jpg'],
    coverImage: 'https://img.goraymi.com/2018/03/05/64b331287baeb314a463459ba689bca2_xl.jpg'
  },
  // Montañas
  {
    name: 'Montaña Súa',
    description: 'Mirador natural con vistas panorámicas al mar y la selva.',
    category: 'montaña',
    location: 'Súa, Esmeraldas',
    images: ['https://scontent.fuio1-2.fna.fbcdn.net/v/t39.30808-6/306615839_497472019052091_1812309768281674186_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFL7IXYMpav8ZamRYoOKsu7VNNMX0fYdMNU00xfR9h0w8qSwJ66NQjB-8XqZcvjH2_DrjdFtb6FRYFaV7L8Cy8F&_nc_ohc=_Pbykdjf7mYQ7kNvwFrvscO&_nc_oc=AdlUc5c8j7KzVxXLzQ7GEFC6qaOyXbSIMUiLYQatBV-lxrDyjENPTdaumgjSlAMea-734NxSpb83M9HVrmAeQEDS&_nc_zt=23&_nc_ht=scontent.fuio1-2.fna&_nc_gid=wLSvrcCYezVJ6_FeQcPzyg&oh=00_AfSOiIQoAMbv4iAQ8Nf_Fz70WKF2G2ZLwwVvtbDxXSDwfQ&oe=6872683B'],
    coverImage: 'https://scontent.fuio1-2.fna.fbcdn.net/v/t39.30808-6/306615839_497472019052091_1812309768281674186_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFL7IXYMpav8ZamRYoOKsu7VNNMX0fYdMNU00xfR9h0w8qSwJ66NQjB-8XqZcvjH2_DrjdFtb6FRYFaV7L8Cy8F&_nc_ohc=_Pbykdjf7mYQ7kNvwFrvscO&_nc_oc=AdlUc5c8j7KzVxXLzQ7GEFC6qaOyXbSIMUiLYQatBV-lxrDyjENPTdaumgjSlAMea-734NxSpb83M9HVrmAeQEDS&_nc_zt=23&_nc_ht=scontent.fuio1-2.fna&_nc_gid=wLSvrcCYezVJ6_FeQcPzyg&oh=00_AfSOiIQoAMbv4iAQ8Nf_Fz70WKF2G2ZLwwVvtbDxXSDwfQ&oe=6872683B'
  },
  // Bosques
  {
    name: 'Bosque Protector Bilsa',
    description: 'Bosque tropical húmedo, ideal para observación de aves y biodiversidad.',
    category: 'bosque',
    location: 'Quinindé, Esmeraldas',
    images: ['https://ondavagabunda.wordpress.com/wp-content/uploads/2014/08/p1020888.jpg'],
    coverImage: 'https://ondavagabunda.wordpress.com/wp-content/uploads/2014/08/p1020888.jpg'
  },
  // Museos
  {
    name: 'Museo Arqueológico de Esmeraldas',
    description: 'Museo con piezas precolombinas y artefactos de la cultura Tolita.',
    category: 'museo',
    location: 'Esmeraldas, Ecuador',
    images: ['https://muna.culturaypatrimonio.gob.ec/wp-content/uploads/2023/12/Museo-y-centro-cultural-de-esmeraldas-3-768x512.jpg'],
    coverImage: 'https://muna.culturaypatrimonio.gob.ec/wp-content/uploads/2023/12/Museo-y-centro-cultural-de-esmeraldas-3-768x512.jpg'
  },
  // Iglesias
  {
    name: 'Catedral Cristo Rey',
    description: 'Iglesia principal de Esmeraldas, arquitectura moderna y vitrales.',
    category: 'iglesia',
    location: 'Esmeraldas, Ecuador',
    images: ['https://scontent.fuio1-1.fna.fbcdn.net/v/t39.30808-6/382772055_3200756710216866_6739609864994121144_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHrc2DJFv_sgBYhH_cn3h5oRrjr5CV7b0JGuOvkJXtvQjNmWc85mBVfZWDtav6zvhgHuFg8aOVtcmp63BpQtmA-&_nc_ohc=v_iLyF9actEQ7kNvwH1is3s&_nc_oc=AdleXVtfRFwj2ZTfGXb0eivwSzKZPZ8HrY5DJM8kXcH1NY9JpvjiRKULjSqcR6eYao9-dGiyXEPTUhOQ3ccyvWv7&_nc_zt=23&_nc_ht=scontent.fuio1-1.fna&_nc_gid=UiXUixzxdMh3esq5zqIDPA&oh=00_AfRurqDIEE3KQg8ASKaQylO-j_M-elDHVSRnecfP54NvFg&oe=68724A5F'],
    coverImage: 'https://scontent.fuio1-1.fna.fbcdn.net/v/t39.30808-6/382772055_3200756710216866_6739609864994121144_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHrc2DJFv_sgBYhH_cn3h5oRrjr5CV7b0JGuOvkJXtvQjNmWc85mBVfZWDtav6zvhgHuFg8aOVtcmp63BpQtmA-&_nc_ohc=v_iLyF9actEQ7kNvwH1is3s&_nc_oc=AdleXVtfRFwj2ZTfGXb0eivwSzKZPZ8HrY5DJM8kXcH1NY9JpvjiRKULjSqcR6eYao9-dGiyXEPTUhOQ3ccyvWv7&_nc_zt=23&_nc_ht=scontent.fuio1-1.fna&_nc_gid=UiXUixzxdMh3esq5zqIDPA&oh=00_AfRurqDIEE3KQg8ASKaQylO-j_M-elDHVSRnecfP54NvFg&oe=68724A5F'
  },
  // Parques
  {
    name: 'Parque Central de Esmeraldas',
    description: 'Parque emblemático en el centro de la ciudad, punto de encuentro y eventos.',
    category: 'parque',
    location: 'Esmeraldas, Ecuador',
    images: ['https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOJZ76SZPAv11gHBQGvqrBrk5YsD8_e06Qd0JRwYzPTbYUwq4WAua23yvDuvtkS0hR6ntMYtyx5COZ0YchlJuQxEpXIRUamKWi_WukhVQvOIIZGVkIztvXis4zVRb0DTRUonRzmyIosO0/s1600/11656664.jpg'],
    coverImage: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOJZ76SZPAv11gHBQGvqrBrk5YsD8_e06Qd0JRwYzPTbYUwq4WAua23yvDuvtkS0hR6ntMYtyx5COZ0YchlJuQxEpXIRUamKWi_WukhVQvOIIZGVkIztvXis4zVRb0DTRUonRzmyIosO0/s1600/11656664.jpg'
  },
  // Miradores
  {
    name: 'Mirador Las Peñas',
    description: 'Mirador con vista al mar y a la ciudad, ideal para fotos panorámicas.',
    category: 'mirador',
    location: 'Las Peñas, Esmeraldas',
    images: ['https://megustavolar.iberia.com/wp-content/uploads/mgv/L2F-Apr-18-pic-Ecuador-Las-Pe%C3%B1as-Cerro-Santa-Ana-640x427-640x427.jpg'],
    coverImage: 'https://megustavolar.iberia.com/wp-content/uploads/mgv/L2F-Apr-18-pic-Ecuador-Las-Pe%C3%B1as-Cerro-Santa-Ana-640x427-640x427.jpg'
  },
  // Gastronomía
  {
    name: 'Restaurante El Camarón Dorado',
    description: 'Restaurante típico con platos de mariscos y especialidad en camarón.',
    category: 'gastronomía',
    location: 'Esmeraldas, Ecuador',
    images: ['https://scontent.fuio1-1.fna.fbcdn.net/v/t1.6435-9/67310670_367660127265039_1719344609101873152_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEGepgT9sEOf5yD1ujBPczbYlokIGtHvktiWiQga0e-Syu7aVSvdU3gmjjhEfOhcYuOXlYq0P9udSq2vzOYAWWz&_nc_ohc=xoT0GDOa-akQ7kNvwGB0y6E&_nc_oc=AdkuM5THi0FhjN14jNU3eDT0s1TqEKV3jHLXvQ-TS4y0gISPwLOzowOUJI9aZU_WZUE5naGdU5X1nfHP1FYEIAQJ&_nc_zt=23&_nc_ht=scontent.fuio1-1.fna&_nc_gid=A48p_iwKe6FNvHZ3OFB94A&oh=00_AfT3eF9PGuuVPCU-bl3nIxLqGQmNZjaqB3HwRK730Ba_XA&oe=6893F409'],
    coverImage: 'https://scontent.fuio1-1.fna.fbcdn.net/v/t1.6435-9/67310670_367660127265039_1719344609101873152_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEGepgT9sEOf5yD1ujBPczbYlokIGtHvktiWiQga0e-Syu7aVSvdU3gmjjhEfOhcYuOXlYq0P9udSq2vzOYAWWz&_nc_ohc=xoT0GDOa-akQ7kNvwGB0y6E&_nc_oc=AdkuM5THi0FhjN14jNU3eDT0s1TqEKV3jHLXvQ-TS4y0gISPwLOzowOUJI9aZU_WZUE5naGdU5X1nfHP1FYEIAQJ&_nc_zt=23&_nc_ht=scontent.fuio1-1.fna&_nc_gid=A48p_iwKe6FNvHZ3OFB94A&oh=00_AfT3eF9PGuuVPCU-bl3nIxLqGQmNZjaqB3HwRK730Ba_XA&oe=6893F409'
  }
];

async function createPlaces() {
  for (const place of places) {
    try {
      const response = await axios.post(BASE_URL, place, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Lugar creado: ${place.name}`);
    } catch (error) {
      console.error(`❌ Error creando ${place.name}:`, error.response?.data || error.message);
    }
  }
}

createPlaces(); 