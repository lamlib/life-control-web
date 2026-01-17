# Life Control Web - Project Documentation

## Tong Quan Du An

Portfolio website ca nhan cua **Nhat Nguyen** - Software Engineer tai Foxconn, Bac Ninh, Vietnam. Website gioi thieu ve ban than, cac du an da thuc hien, dich vu cung cap va blog chia se kien thuc.

## Cong Nghe Su Dung

- **Framework CSS**: Tailwind CSS v4
- **Build Tool**: Vite
- **Font**:
  - Inter Tight (body text)
  - Space Grotesk (headings, display)
- **Language**: HTML, CSS, JavaScript

## Cau Truc Thu Muc

```
life-control-web/
├── pages/
│   ├── about-me.html      # Trang gioi thieu ca nhan
│   └── login.html         # Trang dang nhap
├── src/
│   ├── css/
│   │   ├── main.css           # Design tokens & Tailwind config
│   │   ├── components/
│   │   │   └── toast.css      # Toast notification styles
│   │   └── pages/
│   │       └── about-us.css   # Styles cho trang About
│   └── ...
├── articles/              # Bai viet blog
└── ...
```

## Design System - Energy Theme

### Color Palette (Red Energy)

```css
/* Primary - Red */
--color-red-50: #FEF2F2
--color-red-100: #FEE2E2
--color-red-200: #FECACA
--color-red-300: #FCA5A5
--color-red-400: #F87171
--color-red-500: #EF4444   /* Main brand color */
--color-red-600: #DC2626
--color-red-700: #B91C1C
--color-red-800: #991B1B
--color-red-900: #7F1D1D

/* Neutrals */
--color-white: #FFFFFF
--color-gray-50 to --color-gray-900
--color-black: #0A0A0A

/* Accents */
--color-orange: #F97316
--color-amber: #F59E0B
--color-coral: #FF6B6B
```

### Typography

- **Headings**: Space Grotesk, font-weight 700, letter-spacing -0.03em
- **Body**: Inter Tight, font-weight 400-500
- **Labels**: Inter Tight, uppercase, letter-spacing 0.1-0.15em

### Components

1. **Navigation (nav-energy)**
   - Glassmorphism background
   - Logo voi animated dot
   - Links co hover underline animation

2. **Hero Section (hero-energy)**
   - Gradient blob background
   - Profile image voi red gradient border
   - Floating stat cards
   - Status badge voi pulse animation

3. **Buttons (btn-energy-*)**
   - `btn-energy-primary`: Red background
   - `btn-energy-secondary`: Dark background
   - `btn-energy-outline`: Border only
   - `btn-energy-white`: White background
   - `btn-energy-ghost-white`: Transparent voi white border

4. **Cards**
   - `project-card`: Project showcase
   - `workflow-card`: Process steps
   - `service-card`: Service offerings
   - `article-card`: Blog posts

5. **Gradients**
   - `gradient-red`: Red to darker red
   - `gradient-orange`: Orange to amber
   - `gradient-coral`: Coral to light red
   - `gradient-dark`: Dark gray gradient

### Animations

- **pulse-energy**: Pulsing dot voi glow effect
- **marquee**: Tech stack infinite scroll
- Hover transitions: `cubic-bezier(0.34, 1.56, 0.64, 1)` (springy)

## Cac Trang Chinh

### 1. About Me (`/pages/about-me.html`)

**Sections:**
- Hero: Gioi thieu ban than, status badge, CTA buttons
- Tech Marquee: Danh sach tech stack chay ngang
- Projects: Featured projects + All projects table
- Workflow: 4 buoc quy trinh lam viec
- Blog: 3 bai viet moi nhat
- Services: 4 dich vu cung cap
- CTA: Lien he
- Footer: Links, social media

**SEO:**
- Meta tags day du (title, description, keywords)
- Open Graph tags cho Facebook
- Twitter Card tags
- JSON-LD structured data

### 2. Articles (`/articles`)
- Danh sach bai viet blog

### 3. Login (`/pages/login.html`)
- Trang dang nhap he thong

## Thong Tin Ca Nhan

- **Ten**: Nhat Nguyen
- **Vi tri**: Software Engineer
- **Cong ty**: Foxconn Corporation
- **Dia diem**: Bac Ninh, Vietnam
- **Kinh nghiem**: 5+ nam
- **So du an**: 20+

## Dich Vu Cung Cap

1. **Web Development**: React, Vue, Node.js, REST/GraphQL APIs
2. **System Design**: Microservices, Database Design, Cloud Architecture
3. **Data Analytics**: Data Visualization, Dashboards, ETL Pipelines
4. **AI Integration**: LLM Integration, Machine Learning, Automation

## Du An Tieu Bieu

| # | Ten Du An | Tech Stack | Nam |
|---|-----------|------------|-----|
| 01 | Factory GPT Ecosystem | Python, LangChain, React | 2024 |
| 02 | Training Application | Vue.js, Django, PostgreSQL | 2023 |
| 03 | Automatic Vehicle Guide | Python, ROS, TensorFlow | 2023 |
| 04 | Life Control Web | JavaScript, Vite, Tailwind | 2024 |
| 05 | Internal Dashboard | React, D3.js, Express | 2022 |

## Social Links

- GitHub: github.com/nhatnguyen
- LinkedIn: linkedin.com/in/nhatnguyen
- Twitter: twitter.com/nhatnguyen
- Email: hello@nhatnguyen.dev

## Build & Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build
```

## Luu Y Khi Phat Trien

1. **CSS**: Su dung CSS custom properties (variables) cho colors
2. **Responsive**: Mobile-first approach, breakpoints tai 768px va 1024px
3. **Accessibility**:
   - Focus styles voi red outline
   - Reduced motion support
   - Semantic HTML
4. **Performance**:
   - Font preload
   - Image lazy loading
   - CSS optimization

## Version History

- **v1.0**: Initial design (luxury gold theme)
- **v2.0**: Redesign voi Energy theme (red, young, professional)
