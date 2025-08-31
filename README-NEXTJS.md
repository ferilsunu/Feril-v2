# Feril Sunu Portfolio - Next.js Version

A modern, responsive portfolio website built with Next.js, featuring a cyberpunk/hacker theme and modular architecture for optimal performance and maintainability.

## 🚀 Live Demo

- **Landing Page**: Animated terminal hacking sequence
- **Portfolio**: Complete professional portfolio with sections for experience, education, skills, projects, and certificates

## 🏗️ Project Structure

```
portfolio-nextjs/
├── components/
│   ├── Layout.tsx              # Main layout wrapper
│   ├── BackgroundEffects.tsx   # Matrix rain & particle effects
│   └── Navigation.tsx          # Sidebar and mobile navigation
├── pages/
│   ├── index.tsx              # Landing page with terminal animation
│   └── portfolio.tsx          # Main portfolio page
├── public/
│   ├── styles/
│   │   └── portfolio.css      # All portfolio styles
│   ├── photo.png              # Profile image
│   └── certificates/          # Certificate images and PDFs
├── package.json
├── next.config.js             # Next.js configuration for static export
└── tsconfig.json              # TypeScript configuration
```

## 🎯 Key Features

### ✨ Modern Next.js Architecture
- **Static Site Generation (SSG)**: Optimized for Cloudflare Pages
- **TypeScript**: Type-safe development
- **Component-based**: Modular and reusable components
- **CSS Modules**: Scoped styling with global CSS for animations

### 🎨 Interactive Animations
- **Matrix Rain Effect**: Dynamic background animation
- **Terminal Hacking Simulation**: Engaging landing page experience
- **Particle System**: Floating visual effects
- **Smooth Transitions**: Professional page transitions and hover effects

### 📱 Responsive Design
- **Mobile-First**: Optimized for all device sizes
- **Touch-Friendly**: Mobile navigation and interactions
- **Progressive Enhancement**: Works without JavaScript

### 🔧 Project Features
- **Category Filtering**: Filter projects by type (Web Apps, Company, Personal, Tools)
- **Grid Layout**: Responsive project cards
- **Interactive Elements**: Hover effects and smooth animations
- **Professional Timeline**: Experience and education sections

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:3000`

### Build for Production

1. **Build static site**
   ```bash
   npm run build
   ```

2. **Export static files**
   ```bash
   npm run export
   ```

The static files will be generated in the `out/` directory.

## 🌐 Deployment on Cloudflare Pages

### Method 1: Git Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio-nextjs.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build && npm run export`
     - **Build output directory**: `out`
     - **Root directory**: `/`

3. **Deploy**
   - Cloudflare will automatically build and deploy
   - Your site will be available at `https://your-project.pages.dev`

### Method 2: Direct Upload

1. **Build the project**
   ```bash
   npm run build
   npm run export
   ```

2. **Upload to Cloudflare Pages**
   - Go to Cloudflare Pages dashboard
   - Click "Upload assets"
   - Upload the contents of the `out/` directory

## 📝 Customization

### Personal Information
Update the content directly in the components:
- **Profile info**: `pages/portfolio.tsx`
- **Experience**: Timeline items in portfolio page
- **Skills**: Skill categories and tags
- **Projects**: Project cards with categories
- **Certificates**: Certificate cards

### Styling
- **Colors**: Modify CSS variables in `public/styles/portfolio.css`
- **Animations**: Adjust animation durations and effects
- **Layout**: Responsive breakpoints and grid layouts

### Adding New Sections
1. Create new section in `pages/portfolio.tsx`
2. Add navigation item in `components/Navigation.tsx`
3. Update active section state management

## 🎨 Design System

### Color Palette
```css
--primary-green: #00ff00;
--accent-green: #00cc00;
--cyan: #00ffff;
--gray-900: #000000;
--white: #ffffff;
```

### Typography
- **Headers**: Inter (modern, readable)
- **Body**: Inter (consistent)
- **Code**: JetBrains Mono (monospace)
- **Terminal**: Share Tech Mono (retro)

### Components
- **Cards**: Glassmorphism with hover animations
- **Buttons**: Neon glow effects
- **Navigation**: Smooth active states
- **Timeline**: Professional experience layout

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance Optimizations

- **Static Generation**: Pre-rendered HTML for fast loading
- **Image Optimization**: Next.js automatic image optimization
- **CSS Optimization**: Minified and optimized styles
- **JavaScript Splitting**: Automatic code splitting
- **Lazy Loading**: Components loaded on demand

## 🔧 Development

### File Organization
- **Components**: Reusable UI components in `/components`
- **Pages**: Route-based pages in `/pages`
- **Styles**: Global styles in `/public/styles`
- **Assets**: Images and files in `/public`

### Code Quality
- **TypeScript**: Type safety and better development experience
- **ESLint**: Code linting and formatting
- **Consistent Naming**: Clear component and file naming

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio. If you make improvements that could benefit others, consider submitting a pull request!

---

**Built with ❤️ using Next.js and deployed on Cloudflare Pages**

### 🌟 Features Comparison

| Feature | HTML Version | Next.js Version |
|---------|-------------|-----------------|
| Performance | Good | Excellent (SSG) |
| SEO | Basic | Advanced |
| Development | Manual | Component-based |
| Deployment | Any host | Optimized for Cloudflare |
| Maintenance | Complex | Modular |
| TypeScript | No | Yes |
| Hot Reload | No | Yes |