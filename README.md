# Patient Registration System

A comprehensive patient registration form built with React and Node.js, featuring address verification, pharmacy search, and MongoDB integration.

## 🚀 Features

- **Multi-step Form**: 10-step patient registration process
- **Address Verification**: Integration with Smarty Streets API for address validation
- **Pharmacy Search**: Search pharmacies by ZIP code using OpenStreetMap
- **MongoDB Integration**: Patient data stored in MongoDB
- **Email Notifications**: Automated confirmation emails upon registration
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Form Validation**: Comprehensive client-side and server-side validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EnterpriseGradeEducationalERP/Patient-registration-form-.git
   cd patient-registration-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/NHS_NPMS
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # Smarty Streets API (Optional - for address verification)
   SMARTY_AUTH_ID=your-smarty-auth-id
   SMARTY_AUTH_TOKEN=your-smarty-auth-token
   
   # Frontend URL (for production)
   FRONTEND_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   # Start backend
   npm run dev:backend
   
   # In a new terminal, start frontend
   npm run dev:frontend
   ```

## 📁 Project Structure

```
patient-registration-react/
├── src/
│   ├── components/          # React components
│   │   ├── PersonalInfo.jsx
│   │   ├── ContactInfo.jsx
│   │   ├── AddressInfo.jsx
│   │   ├── EmploymentInfo.jsx
│   │   ├── PharmacyInfo.jsx
│   │   ├── InsuranceInfo.jsx
│   │   ├── MedicalHistory.jsx
│   │   ├── ConsentForms.jsx
│   │   ├── Preferences.jsx
│   │   └── ReviewPage.jsx
│   ├── services/            # API services
│   │   ├── api.js
│   │   ├── addressApi.js
│   │   ├── pharmacyApi.js
│   │   └── uspsApi.js
│   ├── hooks/              # Custom React hooks
│   │   └── useFormState.js
│   ├── utils/              # Utility functions
│   │   └── validation.js
│   └── styles/             # CSS files
│       └── tailwind.css
├── server/                  # Backend server
│   ├── services/           # Service modules
│   │   ├── smartyService.cjs
│   │   ├── pharmacyService.cjs
│   │   └── uspsService.cjs
│   └── server.cjs          # Main server file
├── public/                  # Static files
└── deploy/                  # Deployment files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server (frontend)
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run preview` - Preview production build

## 🌐 API Endpoints

### Patient Registration
- `POST /api/register-patient` - Register a new patient
- `GET /api/patients` - Get all patients
- `POST /api/check-duplicate` - Check for duplicate patients

### Address Verification
- `POST /api/verify-address` - Verify address using Smarty Streets
- `GET /api/zip-lookup/:zip5` - Get city/state from ZIP code
- `GET /api/autocomplete-address` - Address autocomplete suggestions

### Pharmacy Search
- `GET /api/search-pharmacies/:zipCode` - Search pharmacies by ZIP code

### Health Check
- `GET /api/health` - Server health check

## 📦 Deployment

See the deployment guides in the repository:
- `HOSTINGER_DEPLOYMENT_GUIDE.md` - Complete Hostinger deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- `FIX_404_ERROR.md` - Troubleshooting API routing issues

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `PORT` | Server port | No (default: 3000) |
| `EMAIL_USER` | Gmail address for sending emails | No |
| `EMAIL_PASSWORD` | Gmail app password | No |
| `SMARTY_AUTH_ID` | Smarty Streets Auth ID | No (for address verification) |
| `SMARTY_AUTH_TOKEN` | Smarty Streets Auth Token | No (for address verification) |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## 🐛 Troubleshooting

### API 404 Errors
If you're getting "This Page Does Not Exist" errors when calling API endpoints, see `FIX_404_ERROR.md` for detailed troubleshooting steps.

### MongoDB Connection Issues
See `MONGODB_SETUP_GUIDE.md` for MongoDB setup instructions.

### Address Verification Not Working
See `SMARTY_SETUP_GUIDE.md` for Smarty Streets API configuration.

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and MongoDB**

