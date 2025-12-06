require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer'); // Added for email
const smartyService = require('./server/services/smartyService.cjs'); // Smarty Streets API (Address Verification)
const pharmacyService = require('./server/services/pharmacyService.cjs'); // OpenStreetMap Nominatim API for Pharmacy Search

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*' 
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from dist folder if in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/NHS_NPMS');
        console.log(`🗄️ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error.message);
        console.log('⚠️  Server will continue without database. Some features may not work.');
        console.log('💡 Make sure MongoDB is running: mongodb://localhost:27017');
        return false;
    }
};

// Email configuration - ADDED THIS SECTION
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
        service: 'gmail',  // ← This is the key change!
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Verify email connection
    transporter.verify(function(error, success) {
        if (error) {
            console.log('❌ Email server connection error:', error);
        } else {
            console.log('✅ Email server is ready to send messages');
        }
    });
} else {
    console.log('ℹ️  Email credentials not found. Email functionality disabled.');
}

// Patient Schema with exact column names
const patientSchema = new mongoose.Schema({
    NPMS_PATIENTID: {
        type: String,
        required: true,
        unique: true
    },
    NPMS_PATIENT_FIRSTNAME: {
        type: String,
        required: true,
        trim: true
    },
    NPMS_PATIENT_MIDDLENAME: {
        type: String,
        trim: true
    },
    NPMS_PATIENT_LASTNAME: {
        type: String,
        required: true,
        trim: true
    },
    NPMS_PATIENT_DATEOFBIRTH: {
        type: Date,
        required: true
    },
    NPMS_PATIENT_GENDER: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    NPMS_PATIENT_MARITALSTATUS: {
        type: String,
        required: true,
        enum: ['Single', 'Married', 'Divorced', 'Widowed']
    },
    NPMS_PATIENT_SSN: {
        type: String,
        required: true,
        unique: true
    },
    NPMS_PATIENT_UDOC: String,
    NPMS_PATIENT_EMAIL: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    NPMS_PATIENT_PHONE: {
        type: String,
        required: true
    },
    NPMS_PATIENT_APHONE: String,
    NPMS_PATIENT_EMAR_CNAME: String,
    NPMS_PATIENT_EMAR_CNUMBER: String,
    NPMS_PATIENT_PREF_CON: String,
    NPMS_PATIENT_RA_APT: String,
    NPMS_PATIENT_RA_ADD1: String,
    NPMS_PATIENT_RA_ADD2: String,
    NPMS_PATIENT_RA_STREET: String,
    NPMS_PATIENT_RA_CITY: String,
    NPMS_PATIENT_RA_STATE: String,
    NPMS_PATIENT_RA_ZIP: String,
    NPMS_PATIENT_MA_APT: String,
    NPMS_PATIENT_MA_ADD1: String,
    NPMS_PATIENT_MA_ADD2: String,
    NPMS_PATIENT_MA_STREET: String,
    NPMS_PATIENT_MA_CITY: String,
    NPMS_PATIENT_MA_STATE: String,
    NPMS_PATIENT_MA_ZIP: String,
    NPMS_PATIENT_EMPSTATUS: String,
    NPMS_PATIENT_OCCUPATION: String,
    NPMS_PATIENT_ANNUALINCOME: String,
    NPMS_PATIENT_PH_ZIP: String,
    NPM_PATIENT_PH_LOCATION: String,
    NPMS_PATIENT_PI_INS_NAME: String,
    NPMS_PATIENT_PI_POLICYNUMBER: String,
    NPMS_PATIENT_PI_GROUPID: String,
    NPMS_PATIENT_PI_EFF_DATE: Date,
    NPMS_PATIENT_PI_TERM_DATE: Date,
    NPMS_PATIENT_SI_INS_NAME: String,
    NPMS_PATIENT_SI_POLICYNUMBER: String,
    NPMS_PATIENT_SI_GROUPID: String,
    NPMS_PATIENT_SI_EFF_DATE: Date,
    NPMS_PATIENT_SI_TERM_DATE: Date,
    NPMS_PATIENT_HEIGHT: String,
    NPMS_PATIENT_WEIGHT: String,
    NPMS_PATIENT_BP: String,
    NPMS_PATIENT_PREVIOUS_ILLNESS: [String],
    NPMS_PATIENT_DIAGNOSIS: [String],
    NPMS_PATIENT_SURGERIES: [String],
    NPMS_PATIENT_ALLERGIES: [String],
    NPMS_PATIENT_CMEDICATIONS: [String],
    NPMS_PATIENT_FAM_MED_HISTORY: String,
    NPMS_PATIENT_PREF_LANGUAGE: String,
    NPMS_PATIENT_PREF_COM: String,
    NPMS_PATIENT_PREF_DOC_FORMAT: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for duplicate checking
patientSchema.index({ 
    NPMS_PATIENT_FIRSTNAME: 1, 
    NPMS_PATIENT_LASTNAME: 1, 
    NPMS_PATIENT_DATEOFBIRTH: 1, 
    NPMS_PATIENT_SSN: 1 
}, { unique: true });

const Patient = mongoose.model('NPMS_PATIENT_DETAILS', patientSchema);

// API endpoint to register a new patient - MODIFIED TO INCLUDE EMAIL
app.post('/api/register-patient', async (req, res) => {
    try {
        const formData = req.body;
        console.log('Received patient data:', formData);

        // Map frontend data to database columns
        const patientData = {
            NPMS_PATIENT_FIRSTNAME: formData.firstName,
            NPMS_PATIENT_MIDDLENAME: formData.middleName,
            NPMS_PATIENT_LASTNAME: formData.lastName,
            NPMS_PATIENT_DATEOFBIRTH: formData.dob,
            NPMS_PATIENT_GENDER: formData.gender,
            NPMS_PATIENT_MARITALSTATUS: formData.maritalStatus,
            NPMS_PATIENT_SSN: formData.ssn,
            NPMS_PATIENT_EMAIL: formData.email,
            NPMS_PATIENT_PHONE: formData.primaryContact,
            NPMS_PATIENT_APHONE: formData.secondaryContact,
            NPMS_PATIENT_EMAR_CNAME: formData.emergencyName,
            NPMS_PATIENT_EMAR_CNUMBER: formData.emergencyContact,
            NPMS_PATIENT_PREF_CON: formData.preferredMode,
            NPMS_PATIENT_RA_APT: formData.resApt,
            NPMS_PATIENT_RA_ADD1: formData.resAddress1,
            NPMS_PATIENT_RA_ADD2: formData.resAddress2,
            NPMS_PATIENT_RA_STREET: formData.resStreet,
            NPMS_PATIENT_RA_CITY: formData.resCity,
            NPMS_PATIENT_RA_STATE: formData.resState,
            NPMS_PATIENT_RA_ZIP: formData.resZip,
            NPMS_PATIENT_MA_APT: formData.mailApt,
            NPMS_PATIENT_MA_ADD1: formData.mailAddress1,
            NPMS_PATIENT_MA_ADD2: formData.mailAddress2,
            NPMS_PATIENT_MA_STREET: formData.mailStreet,
            NPMS_PATIENT_MA_CITY: formData.mailCity,
            NPMS_PATIENT_MA_STATE: formData.mailState,
            NPMS_PATIENT_MA_ZIP: formData.mailZip,
            NPMS_PATIENT_EMPSTATUS: formData.employmentStatus,
            NPMS_PATIENT_OCCUPATION: formData.occupation,
            NPMS_PATIENT_ANNUALINCOME: formData.income,
            NPMS_PATIENT_PH_ZIP: formData.zipCode,
            NPM_PATIENT_PH_LOCATION: formData.pharmacyInput,
            NPMS_PATIENT_PI_INS_NAME: formData.provider,
            NPMS_PATIENT_PI_POLICYNUMBER: formData.policy,
            NPMS_PATIENT_PI_GROUPID: formData.group,
            NPMS_PATIENT_PI_EFF_DATE: formData.effective,
            NPMS_PATIENT_PI_TERM_DATE: formData.termination,
            NPMS_PATIENT_SI_INS_NAME: formData.provider2,
            NPMS_PATIENT_SI_POLICYNUMBER: formData.policy2,
            NPMS_PATIENT_SI_GROUPID: formData.group2,
            NPMS_PATIENT_SI_EFF_DATE: formData.effective2,
            NPMS_PATIENT_SI_TERM_DATE: formData.termination2,
            NPMS_PATIENT_HEIGHT: formData.heightValue,
            NPMS_PATIENT_WEIGHT: formData.weightValue,
            NPMS_PATIENT_BP: formData.bpValue,
            NPMS_PATIENT_PREVIOUS_ILLNESS: formData.previousIllness || [],
            NPMS_PATIENT_DIAGNOSIS: formData.diagnoses || [],
            NPMS_PATIENT_ALLERGIES: formData.allergies || [],
            NPMS_PATIENT_SURGERIES: formData.surgeries || [],
            NPMS_PATIENT_CMEDICATIONS: formData.medications || [],
            NPMS_PATIENT_FAM_MED_HISTORY: formData.familyHistory,
            NPMS_PATIENT_PREF_LANGUAGE: formData.languageInput,
            NPMS_PATIENT_PREF_COM: formData.commMethod,
            NPMS_PATIENT_PREF_DOC_FORMAT: formData.delivery
        };

        // Check for duplicates
        const duplicate = await Patient.findOne({
            NPMS_PATIENT_FIRSTNAME: patientData.NPMS_PATIENT_FIRSTNAME,
            NPMS_PATIENT_LASTNAME: patientData.NPMS_PATIENT_LASTNAME,
            NPMS_PATIENT_DATEOFBIRTH: patientData.NPMS_PATIENT_DATEOFBIRTH,
            NPMS_PATIENT_SSN: patientData.NPMS_PATIENT_SSN
        });

        if (duplicate) {
            return res.status(409).json({ 
                success: false, 
                message: 'Patient already exists in our system.' 
            });
        }

        // Generate patient ID
        const lastPatient = await Patient.findOne().sort({ createdAt: -1 });
        const sequentialNumber = lastPatient ? 
            String(parseInt(lastPatient.NPMS_PATIENTID.slice(-5)) + 1).padStart(5, '0') : 
            '00001';
        
        patientData.NPMS_PATIENTID = `${patientData.NPMS_PATIENT_FIRSTNAME.charAt(0).toUpperCase()}${patientData.NPMS_PATIENT_SSN.slice(-4)}${sequentialNumber}`;

        // Save to MongoDB
        const newPatient = new Patient(patientData);
        const savedPatient = await newPatient.save();

        console.log(`✅ Patient saved with ID: ${savedPatient.NPMS_PATIENTID}`);
        
        // SEND CONFIRMATION EMAIL - ADDED THIS SECTION
        if (transporter && patientData.NPMS_PATIENT_EMAIL) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: patientData.NPMS_PATIENT_EMAIL,
                    subject: 'Patient Registration Confirmation - NextGen Product Labs',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #2563eb;">Welcome to NextGen Health Care, ${patientData.NPMS_PATIENT_FIRSTNAME}!</h2>
                            <p>Your patient registration has been successfully completed.</p>
                            <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <p><strong>Patient ID:</strong> ${savedPatient.NPMS_PATIENTID}</p>
                                <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>
                            <p>Please keep this Patient ID for all future communications.</p>
                            <p>Thank you for choosing our healthcare services.</p>
                            <hr style="margin: 30px 0;">
                            <p style="color: #6b7280; font-size: 12px;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`📧 Confirmation email sent to: ${patientData.NPMS_PATIENT_EMAIL}`);
                
            } catch (emailError) {
                console.error('Email sending failed (non-critical):', emailError);
                // Don't fail the registration if email fails
            }
        }

        res.status(201).json({ 
            success: true, 
            message: 'Patient registered successfully!',
            patientId: savedPatient.NPMS_PATIENTID
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                success: false, 
                message: 'Patient already exists or duplicate data detected.' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error during registration' 
        });
    }
});

// GET endpoint to fetch all patients
app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json({ success: true, patients });
    } catch (error) {
        console.error('Fetch patients error:', error);
        res.status(500).json({ success: false, message: 'Error fetching patients' });
    }
});

// Email test endpoint - ADDED THIS SECTION
app.get('/api/test-email', async (req, res) => {
    if (!transporter) {
        return res.status(500).json({ 
            success: false, 
            message: 'Email transporter not configured' 
        });
    }
    
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email from NHS NPMS System',
            text: 'This is a test email from your patient registration system.'
        });
        
        res.json({ success: true, message: 'Test email sent successfully!' });
    } catch (error) {
        console.error('Test email failed:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Test email failed: ' + error.message 
        });
    }
});

// Smarty Address Verification Endpoint
app.post('/api/verify-address', async (req, res) => {
    try {
        const { address1, address2, city, state, zip5, zip4 } = req.body;
        
        // Validate required fields
        if (!address1 || !state) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: address1 and state are required. City or ZIP code is also recommended.'
            });
        }

        if (!city && !zip5) {
            return res.status(400).json({
                success: false,
                error: 'Either city or ZIP code is required for accurate verification'
            });
        }

        // Check if Smarty credentials are configured
        const hasSmartyCredentials = process.env.SMARTY_AUTH_ID && process.env.SMARTY_AUTH_TOKEN;
        
        if (!hasSmartyCredentials) {
            console.error('❌ Smarty credentials missing!');
            console.error('   SMARTY_AUTH_ID:', process.env.SMARTY_AUTH_ID ? '✅ Set' : '❌ Missing');
            console.error('   SMARTY_AUTH_TOKEN:', process.env.SMARTY_AUTH_TOKEN ? '✅ Set' : '❌ Missing');
            console.error('💡 Add SMARTY_AUTH_ID and SMARTY_AUTH_TOKEN to .env file and Node.js Manager environment variables');
            console.error('💡 Then restart the Node.js application');
            
            return res.status(503).json({
                success: false,
                verified: false,
                error: 'Address verification service not configured. Please add SMARTY_AUTH_ID and SMARTY_AUTH_TOKEN to your .env file and Node.js Manager environment variables, then restart the server.',
                help: 'See SMARTY_CREDENTIALS_SETUP.md for instructions'
            });
        }
        
        // Log credentials status (without exposing actual values)
        console.log('✅ Smarty credentials found');
        console.log('   Auth ID:', process.env.SMARTY_AUTH_ID.substring(0, 8) + '...');
        console.log('   Auth Token:', process.env.SMARTY_AUTH_TOKEN.substring(0, 4) + '...');
        console.log('📡 Ready to verify addresses with Smarty Streets API');

        // Prepare address object for Smarty API
        const smartyAddress = {
            address1: address1 || '',
            address2: address2 || '',
            city: city || '',
            state: state || '',
            zip5: zip5 || '',
            zip4: zip4 || ''
        };

        console.log('📡 Verifying address with Smarty Streets API');
        const result = await smartyService.verifyAddress(smartyAddress);
        
        if (result.success && result.verified) {
            res.json({
                success: true,
                verified: true,
                address: result.address,
                message: result.verificationMessage || 'Address verified successfully',
                metadata: result.metadata || null,
                analysis: result.analysis || null,
                verificationMessage: result.verificationMessage || 'Address verified',
                hasCorrections: result.hasCorrections || false
            });
        } else {
            // Return 200 with error info (not 400) so frontend can handle it
            res.status(200).json({
                success: result.success !== false,
                verified: false,
                error: result.error || 'Address could not be verified',
                errorCode: result.errorCode || result.statusCode || null,
                details: result.details || null,
                verificationMessage: result.verificationMessage || 'Verification failed'
            });
        }
    } catch (error) {
        console.error('Address verification error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            verified: false,
            error: 'Server error during address verification',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// ZIP Code Lookup Endpoint (Smarty only)
app.get('/api/zip-lookup/:zip5', async (req, res) => {
    try {
        const { zip5 } = req.params;
        
        if (!zip5 || !/^\d{5}$/.test(zip5)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ZIP code format. Must be 5 digits.'
            });
        }

        // Check if Smarty credentials are configured
        const hasSmartyCredentials = process.env.SMARTY_AUTH_ID && process.env.SMARTY_AUTH_TOKEN;
        
        if (!hasSmartyCredentials) {
            return res.status(503).json({
                success: false,
                error: 'ZIP code lookup service not configured. Please configure SMARTY_AUTH_ID and SMARTY_AUTH_TOKEN in environment variables.',
                city: '',
                state: ''
            });
        }

        console.log('📡 Looking up ZIP code with Smarty API');
        const result = await smartyService.getCityStateFromZip(zip5);
        
        if (result.success) {
            res.json({
                success: true,
                zip5: result.zipCode || zip5,
                city: result.city,
                state: result.state
            });
        } else {
            res.status(200).json({
                success: false,
                error: result.error || 'ZIP code lookup failed',
                zip5: zip5,
                city: '',
                state: ''
            });
        }
    } catch (error) {
        console.error('ZIP lookup error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during ZIP code lookup',
            details: error.message
        });
    }
});

// Address Autocomplete Endpoint (Smarty only - bonus feature)
app.get('/api/autocomplete-address', async (req, res) => {
    try {
        const { search, maxResults } = req.query;
        
        if (!search || search.trim().length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Search query must be at least 3 characters',
                suggestions: []
            });
        }

        const hasSmartyCredentials = process.env.SMARTY_AUTH_ID && process.env.SMARTY_AUTH_TOKEN;
        
        if (!hasSmartyCredentials) {
            return res.status(503).json({
                success: false,
                error: 'Address autocomplete requires Smarty API credentials',
                suggestions: []
            });
        }

        const result = await smartyService.autocompleteAddress(search.trim(), {
            maxResults: parseInt(maxResults) || 10
        });

        if (result.success) {
            res.json({
                success: true,
                suggestions: result.suggestions || []
            });
        } else {
            res.status(200).json({
                success: false,
                error: result.error || 'Autocomplete failed',
                suggestions: []
            });
        }
    } catch (error) {
        console.error('Address autocomplete error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during address autocomplete',
            details: error.message,
            suggestions: []
        });
    }
});

// Pharmacy Search Endpoint (OpenStreetMap Nominatim API - FREE)
app.get('/api/search-pharmacies/:zipCode', async (req, res) => {
    try {
        const { zipCode } = req.params;
        
        // Validate ZIP code
        if (!zipCode || !/^\d{5}$/.test(zipCode)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ZIP code format. Must be 5 digits.',
                pharmacies: []
            });
        }

        // Search pharmacies
        const result = await pharmacyService.searchPharmaciesByZip(zipCode);
        
        if (result.success) {
            res.json({
                success: true,
                pharmacies: result.pharmacies,
                zipCode: zipCode,
                message: result.message || `${result.pharmacies.length} pharmacies found`
            });
        } else {
            res.status(200).json({
                success: false,
                error: result.error || 'Failed to search pharmacies',
                pharmacies: []
            });
        }
    } catch (error) {
        console.error('Pharmacy search error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during pharmacy search',
            details: error.message,
            pharmacies: []
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Start server and connect to DB
const startServer = async () => {
    // Try to connect to database first
    const dbConnected = await connectDB();
    if (!dbConnected && process.env.NODE_ENV === 'production') {
        console.log('⚠️  WARNING: Database connection failed in production mode!');
        console.log('💡 Check your MONGODB_URI environment variable.');
    }
    
    // Start server
    app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📡 API endpoints available at /api`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        if (process.env.NODE_ENV === 'production') {
            console.log(`✅ Production mode enabled`);
        }
    });
};

startServer();