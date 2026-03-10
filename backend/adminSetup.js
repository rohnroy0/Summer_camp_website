const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSMongoose = require('@adminjs/mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Participant = require('./models/Participant');
const { Parser } = require('json2csv');

// Register the Mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

const setupAdmin = async (app) => {
    // Session configuration
    app.use(session({
        secret: process.env.COOKIE_SECRET || 'a-very-long-random-string-for-session-security-12345',
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, secure: false }
    }));

    // Create an AdminJS instance
    const adminJS = new AdminJS({
        databases: [mongoose], // Connect to mongoose database
        resources: [
            {
                resource: Participant,
                options: {
                    navigation: {
                        name: 'Event Management',
                        icon: 'User'
                    },
                    properties: {
                        _id: {
                            isVisible: { list: false, filter: false, show: true, edit: false }
                        },
                        createdAt: {
                            isVisible: { list: true, filter: true, show: true, edit: false }
                        },
                        paymentStatus: {
                            availableValues: [
                                { value: 'true', label: 'Paid' },
                                { value: 'false', label: 'Pending' }
                            ]
                        },
                        checkedIn: {
                            availableValues: [
                                { value: 'true', label: 'Yes' },
                                { value: 'false', label: 'No' }
                            ]
                        }
                    },
                    listProperties: ['name', 'email', 'phone', 'college', 'paymentStatus', 'checkedIn'],
                    filterProperties: ['name', 'email', 'college', 'paymentStatus', 'checkedIn'],
                    editProperties: ['name', 'email', 'phone', 'college', 'department', 'year', 'paymentStatus', 'transactionId', 'ticketId', 'checkedIn'],
                    showProperties: ['name', 'email', 'phone', 'college', 'department', 'year', 'paymentStatus', 'transactionId', 'ticketId', 'checkedIn', 'createdAt'],
                    actions: {
                        new: {
                            isAccessible: true
                        },
                        edit: {
                            isAccessible: true
                        },
                        delete: {
                            isAccessible: true
                        },
                        bulkDelete: {
                            isAccessible: true
                        },
                        exportCsv: {
                            actionType: 'resource',
                            icon: 'Download',
                            handler: async (request, response, context) => {
                                const participants = await Participant.find({});
                                const fields = ['name', 'email', 'phone', 'college', 'department', 'year', 'paymentStatus', 'transactionId', 'ticketId', 'checkedIn', 'createdAt'];
                                const json2csvParser = new Parser({ fields });
                                const csv = json2csvParser.parse(participants);

                                return {
                                    downloadUrl: `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`,
                                    fileName: `participants_${new Date().toISOString()}.csv`
                                };
                            },
                            component: false
                        }
                    }
                }
            }
        ],
        rootPath: '/admin', // The path where admin dashboard will be available
        branding: {
            companyName: 'Summer School 2026',
            softwareBrothers: false,
            logo: false,
            theme: {
                colors: {
                    primary100: '#00f2fe',
                    primary80: '#4facfe',
                    primary60: '#00c6ff',
                    primary40: '#0072ff',
                    primary20: 'rgba(0, 242, 254, 0.1)',
                    bg: '#0a0c10',
                    defaultText: '#ffffff',
                    border: '#1a202c',
                    cardBg: '#111827',
                },
                font: 'Inter, sans-serif',
                borderRadius: '8px'
            }
        },
        dashboard: {
            handler: async () => {
                const count = await Participant.countDocuments();
                const paidCount = await Participant.countDocuments({ paymentStatus: true });
                const checkedInCount = await Participant.countDocuments({ checkedIn: true });
                return {
                    totalParticipants: count,
                    totalPaid: paidCount,
                    totalCheckedIn: checkedInCount
                };
            }
        }
    });

    // Build an authenticated router
    const router = AdminJSExpress.buildAuthenticatedRouter(adminJS, {
        authenticate: async (email, password) => {
            const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
            const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                return { email };
            }
            return null;
        },
        cookieName: 'adminjs',
        cookiePassword: process.env.COOKIE_SECRET || 'a-very-long-random-string-for-session-security-12345',
    }, null, {
        resave: false,
        saveUninitialized: false,
    });

    app.use(adminJS.options.rootPath, router);

    console.log(`AdminJS is running under /admin`);
};

module.exports = setupAdmin;
