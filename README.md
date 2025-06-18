# Optimus Educational Platform

A modern, full-featured educational platform built with React, TypeScript, and Firebase. The platform provides a comprehensive learning management system with real-time admin capabilities, dynamic program management, and a professional user experience.

## 🚀 Features

### Public Features

- **Dynamic Program Catalog**: Browse programs from both static data and admin-created content
- **Real-time Updates**: Programs created by admins appear instantly on the website
- **Advanced Filtering**: Filter by category, level, specialization, and search
- **Responsive Design**: Optimized for all devices
- **Multi-language Support**: Built-in internationalization

### Admin Features

- **Real-time Dashboard**: Live statistics and program management
- **Program Creation**: Full CRUD operations for educational programs
- **Bulk Operations**: Manage multiple programs simultaneously
- **File Upload**: Image upload for program thumbnails
- **Status Management**: Draft and publish workflow
- **Real-time Notifications**: Instant feedback with toast notifications

### Technical Features

- **Firebase Integration**: Firestore database with real-time listeners
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Tailwind CSS with professional design
- **State Management**: React Context with optimized performance
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd optimus-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `src/firebase/firebase.ts`

4. **Set up Firestore Security Rules**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Programs collection
       match /programs/{programId} {
         allow read: if true;
         allow write: if request.auth != null &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }

       // Users collection
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── data/              # Static data and configurations
├── firebase/          # Firebase configuration
├── i18n/             # Internationalization
├── pages/            # Page components
├── services/         # Business logic and API calls
└── types/            # TypeScript type definitions
```

## 🔧 Key Components

### Program Service (`src/services/programService.ts`)

Comprehensive service handling all program operations:

- CRUD operations for admin programs
- Real-time listeners
- File upload management
- Bulk operations
- Statistics calculation

### Admin Dashboard (`src/pages/AdminDashboardPage.tsx`)

Real-time dashboard featuring:

- Live program statistics
- Combined view of admin and static programs
- Real-time updates via Firestore listeners
- Program management actions

### Course Creator (`src/pages/CourseCreatorPage.tsx`)

Full-featured program creation interface:

- Multi-step form with validation
- Image upload with preview
- Dynamic curriculum builder
- Draft/publish workflow

### Programs Page (`src/pages/ProgramsPage.tsx`)

Public program catalog with:

- Real-time program fetching
- Advanced filtering and search
- Responsive grid layout
- Dynamic content updates

## 🔐 Authentication & Authorization

The platform implements role-based access control:

- **Public Users**: Can browse programs and register
- **Students**: Can enroll in programs (future feature)
- **Admins**: Full access to admin dashboard and program management

### Creating Admin Users

1. Register a new user through the normal registration flow
2. Manually update the user's role in Firestore:
   ```javascript
   // In Firestore console, update the user document
   {
     email: "admin@example.com",
     role: "admin",
     // ... other fields
   }
   ```

## 📊 Data Architecture

### Programs Collection

```typescript
interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  type: string;
  duration: string;
  price: number;
  thumbnail?: string;
  requirements?: string[];
  whatYouWillLearn?: string[];
  modules?: ProgramModule[];
  status: "published" | "draft";
  enrollments?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Static vs Dynamic Programs

- **Static Programs**: Defined in `src/data/optimus-data.ts` (read-only)
- **Dynamic Programs**: Created by admins, stored in Firestore (full CRUD)
- **Combined Display**: Both types appear seamlessly in the public catalog

## 🚀 Deployment

### Firebase Hosting

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 🔄 Real-time Features

The platform leverages Firebase's real-time capabilities:

- **Live Dashboard Updates**: Statistics update automatically
- **Instant Program Visibility**: New programs appear immediately
- **Real-time Notifications**: Toast notifications for all actions
- **Optimistic Updates**: UI updates before server confirmation

## 🎨 UI/UX Features

- **Professional Design**: Modern, clean interface
- **Responsive Layout**: Works on all screen sizes
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized rendering and lazy loading

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

## 📈 Performance Optimizations

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Compressed thumbnails
- **Caching**: Firebase caching strategies
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components

## 🔧 Development Tools

- **TypeScript**: Full type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vite**: Fast development server
- **Hot Reload**: Instant development feedback

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Student Enrollment**: Complete enrollment system
- **Payment Integration**: Stripe/PayPal integration
- **Video Streaming**: Integrated video player
- **Progress Tracking**: Student progress analytics
- **Certificates**: Automated certificate generation
- **Mobile App**: React Native companion app

---

Built with ❤️ for modern education
