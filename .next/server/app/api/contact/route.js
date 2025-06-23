/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/contact/route";
exports.ids = ["app/api/contact/route"];
exports.modules = {

/***/ "(rsc)/./app/api/contact/route.ts":
/*!**********************************!*\
  !*** ./app/api/contact/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! nodemailer */ \"(rsc)/./node_modules/nodemailer/lib/nodemailer.js\");\n\n\n// Email routing configuration\nconst EMAIL_ROUTING = {\n    general: 'info@optimusksa.com',\n    admissions: 'admissions@optimusksa.com',\n    support: 'support@optimusksa.com',\n    marketing: 'marketing@optimusksa.com',\n    executive: 'ceo@optimusksa.com'\n};\n// Create transporter (configure with your SMTP settings)\nconst createTransporter = ()=>{\n    const smtpConfig = {\n        host: process.env.SMTP_HOST || 'smtp.gmail.com',\n        port: parseInt(process.env.SMTP_PORT || '587'),\n        secure: process.env.SMTP_SECURE === 'true',\n        auth: {\n            user: process.env.SMTP_USER,\n            pass: process.env.SMTP_PASSWORD\n        }\n    };\n    console.log('SMTP Configuration:', {\n        host: smtpConfig.host,\n        port: smtpConfig.port,\n        secure: smtpConfig.secure,\n        user: smtpConfig.auth.user ? '***configured***' : 'NOT_SET',\n        pass: smtpConfig.auth.pass ? '***configured***' : 'NOT_SET'\n    });\n    return nodemailer__WEBPACK_IMPORTED_MODULE_1__.createTransport(smtpConfig);\n};\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        const { name, email, phone, inquiryType, program, message } = body;\n        // Validate required fields\n        if (!name || !email || !inquiryType || !message) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Required fields: name, email, inquiry type, and message'\n            }, {\n                status: 400\n            });\n        }\n        // Validate email format\n        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n        if (!emailRegex.test(email)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid email format'\n            }, {\n                status: 400\n            });\n        }\n        // Check if SMTP is configured\n        if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {\n            console.error('SMTP not configured. Missing environment variables:', {\n                SMTP_HOST: process.env.SMTP_HOST || 'NOT_SET',\n                SMTP_PORT: process.env.SMTP_PORT || 'NOT_SET',\n                SMTP_USER: process.env.SMTP_USER ? 'SET' : 'NOT_SET',\n                SMTP_PASSWORD: process.env.SMTP_PASSWORD ? 'SET' : 'NOT_SET',\n                SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'NOT_SET'\n            });\n            // For development, log the form data and return success\n            console.log('Contact form submission (SMTP not configured):', {\n                name,\n                email,\n                phone,\n                inquiryType,\n                program,\n                message,\n                timestamp: new Date().toISOString()\n            });\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                message: 'Message received! (Note: Email sending is not configured yet)',\n                warning: 'SMTP configuration required for email delivery',\n                recipientEmail: EMAIL_ROUTING[inquiryType] || EMAIL_ROUTING.general\n            }, {\n                status: 200\n            });\n        }\n        // Get recipient email based on inquiry type\n        const recipientEmail = EMAIL_ROUTING[inquiryType] || EMAIL_ROUTING.general;\n        // Create transporter\n        const transporter = createTransporter();\n        // Test the connection first\n        try {\n            await transporter.verify();\n            console.log('SMTP connection verified successfully');\n        } catch (verifyError) {\n            console.error('SMTP verification failed:', verifyError);\n            throw new Error(`SMTP configuration error: ${verifyError instanceof Error ? verifyError.message : 'Unknown SMTP error'}`);\n        }\n        // Email content for the recipient\n        const recipientEmailContent = {\n            from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,\n            to: recipientEmail,\n            subject: `New ${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)} Inquiry from ${name}`,\n            html: `\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n          <div style=\"background-color: #2B1F4F; color: white; padding: 20px; text-align: center;\">\n            <h1 style=\"margin: 0;\">New Contact Form Submission</h1>\n          </div>\n          \n          <div style=\"padding: 20px; background-color: #f9f9f9;\">\n            <h2 style=\"color: #2B1F4F; margin-top: 0;\">Contact Details</h2>\n            <table style=\"width: 100%; border-collapse: collapse;\">\n              <tr>\n                <td style=\"padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;\">Name:</td>\n                <td style=\"padding: 8px; border-bottom: 1px solid #ddd;\">${name}</td>\n              </tr>\n              <tr>\n                <td style=\"padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;\">Email:</td>\n                <td style=\"padding: 8px; border-bottom: 1px solid #ddd;\">${email}</td>\n              </tr>\n              <tr>\n                <td style=\"padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;\">Phone:</td>\n                <td style=\"padding: 8px; border-bottom: 1px solid #ddd;\">${phone || 'Not provided'}</td>\n              </tr>\n              <tr>\n                <td style=\"padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;\">Inquiry Type:</td>\n                <td style=\"padding: 8px; border-bottom: 1px solid #ddd;\">${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)}</td>\n              </tr>\n              <tr>\n                <td style=\"padding: 8px; font-weight: bold; border-bottom: 1px solid #ddd;\">Program Interest:</td>\n                <td style=\"padding: 8px; border-bottom: 1px solid #ddd;\">${program || 'Not specified'}</td>\n              </tr>\n            </table>\n            \n            <h3 style=\"color: #2B1F4F; margin-top: 20px;\">Message:</h3>\n            <div style=\"background-color: white; padding: 15px; border-left: 4px solid #058C42; margin-top: 10px;\">\n              ${message.replace(/\\n/g, '<br>')}\n            </div>\n          </div>\n          \n          <div style=\"background-color: #2B1F4F; color: white; padding: 15px; text-align: center;\">\n            <p style=\"margin: 0;\">Optimus Education - Contact Form System</p>\n          </div>\n        </div>\n      `\n        };\n        // Confirmation email for the user\n        const confirmationEmail = {\n            from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,\n            to: email,\n            subject: 'Thank you for contacting Optimus Education',\n            html: `\n        <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">\n          <div style=\"background-color: #2B1F4F; color: white; padding: 20px; text-align: center;\">\n            <h1 style=\"margin: 0;\">Thank You for Your Inquiry</h1>\n          </div>\n          \n          <div style=\"padding: 20px;\">\n            <p>Dear ${name},</p>\n            \n            <p>Thank you for reaching out to Optimus Education. We have received your inquiry and our team will get back to you within 24 hours.</p>\n            \n            <div style=\"background-color: #f9f9f9; padding: 15px; border-left: 4px solid #058C42; margin: 20px 0;\">\n              <h3 style=\"color: #2B1F4F; margin-top: 0;\">Your Inquiry Summary:</h3>\n              <p><strong>Inquiry Type:</strong> ${inquiryType.charAt(0).toUpperCase() + inquiryType.slice(1)}</p>\n              <p><strong>Program Interest:</strong> ${program || 'Not specified'}</p>\n              <p><strong>Message:</strong> ${message}</p>\n            </div>\n            \n            <p>In the meantime, feel free to explore our programs and services on our website.</p>\n            \n            <p>If you have any urgent questions, you can also reach us via WhatsApp at +971569852211.</p>\n            \n            <p>Best regards,<br>\n            The Optimus Education Team</p>\n          </div>\n          \n          <div style=\"background-color: #2B1F4F; color: white; padding: 15px; text-align: center;\">\n            <p style=\"margin: 0;\">Optimus Education - Transforming Careers, Shaping Futures</p>\n          </div>\n        </div>\n      `\n        };\n        // Send emails\n        console.log('Sending emails to:', recipientEmail, 'and', email);\n        await Promise.all([\n            transporter.sendMail(recipientEmailContent),\n            transporter.sendMail(confirmationEmail)\n        ]);\n        console.log('Emails sent successfully');\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: 'Contact form submitted successfully. We will get back to you soon!',\n            recipientEmail: recipientEmail\n        }, {\n            status: 200\n        });\n    } catch (error) {\n        console.error('Error in contact form submission:', error);\n        // Return detailed error information\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to send email. Please try again later.',\n            details: error instanceof Error ? error.message : 'Unknown error',\n            timestamp: new Date().toISOString()\n        }, {\n            status: 500\n        });\n    }\n}\n// GET method for testing\nasync function GET() {\n    const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        message: 'Contact API endpoint is working',\n        availableInquiryTypes: Object.keys(EMAIL_ROUTING),\n        emailRouting: EMAIL_ROUTING,\n        smtpConfigured,\n        configuration: {\n            host: process.env.SMTP_HOST || 'NOT_SET',\n            port: process.env.SMTP_PORT || 'NOT_SET',\n            user: process.env.SMTP_USER ? 'SET' : 'NOT_SET',\n            password: process.env.SMTP_PASSWORD ? 'SET' : 'NOT_SET',\n            fromEmail: process.env.SMTP_FROM_EMAIL || 'NOT_SET'\n        }\n    }, {\n        status: 200\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE1BQU1ILFFBQVFDLEdBQUcsQ0FBQ0ksU0FBUyxJQUFJO1lBQy9CSSxNQUFNVCxRQUFRQyxHQUFHLENBQUNTLFNBQVMsR0FBRyxRQUFRO1lBQ3RDbUQsVUFBVTdELFFBQVFDLEdBQUcsQ0FBQ1csYUFBYSxHQUFHLFFBQVE7WUFDOUNrRCxXQUFXOUQsUUFBUUMsR0FBRyxDQUFDNkIsZUFBZSxJQUFJO1FBQzVDO0lBQ0YsR0FDQTtRQUFFSCxRQUFRO0lBQUk7QUFFbEIiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcUmFoaW1cXERvY3VtZW50c1xcTXlBUFBTXFxPcHRpbXVzVGVzdGluZ1xccHJvamVjdFxcYXBwXFxhcGlcXGNvbnRhY3RcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcbmltcG9ydCBub2RlbWFpbGVyIGZyb20gJ25vZGVtYWlsZXInO1xyXG5cclxuaW50ZXJmYWNlIENvbnRhY3RGb3JtRGF0YSB7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIGVtYWlsOiBzdHJpbmc7XHJcbiAgcGhvbmU6IHN0cmluZztcclxuICBpbnF1aXJ5VHlwZTogc3RyaW5nO1xyXG4gIHByb2dyYW06IHN0cmluZztcclxuICBtZXNzYWdlOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIEVtYWlsIHJvdXRpbmcgY29uZmlndXJhdGlvblxyXG5jb25zdCBFTUFJTF9ST1VUSU5HOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xyXG4gIGdlbmVyYWw6ICdpbmZvQG9wdGltdXNrc2EuY29tJyxcclxuICBhZG1pc3Npb25zOiAnYWRtaXNzaW9uc0BvcHRpbXVza3NhLmNvbScsXHJcbiAgc3VwcG9ydDogJ3N1cHBvcnRAb3B0aW11c2tzYS5jb20nLFxyXG4gIG1hcmtldGluZzogJ21hcmtldGluZ0BvcHRpbXVza3NhLmNvbScsXHJcbiAgZXhlY3V0aXZlOiAnY2VvQG9wdGltdXNrc2EuY29tJ1xyXG59O1xyXG5cclxuLy8gQ3JlYXRlIHRyYW5zcG9ydGVyIChjb25maWd1cmUgd2l0aCB5b3VyIFNNVFAgc2V0dGluZ3MpXHJcbmNvbnN0IGNyZWF0ZVRyYW5zcG9ydGVyID0gKCkgPT4ge1xyXG4gIGNvbnN0IHNtdHBDb25maWcgPSB7XHJcbiAgICBob3N0OiBwcm9jZXNzLmVudi5TTVRQX0hPU1QgfHwgJ3NtdHAuZ21haWwuY29tJyxcclxuICAgIHBvcnQ6IHBhcnNlSW50KHByb2Nlc3MuZW52LlNNVFBfUE9SVCB8fCAnNTg3JyksXHJcbiAgICBzZWN1cmU6IHByb2Nlc3MuZW52LlNNVFBfU0VDVVJFID09PSAndHJ1ZScsIC8vIHRydWUgZm9yIDQ2NSwgZmFsc2UgZm9yIG90aGVyIHBvcnRzXHJcbiAgICBhdXRoOiB7XHJcbiAgICAgIHVzZXI6IHByb2Nlc3MuZW52LlNNVFBfVVNFUixcclxuICAgICAgcGFzczogcHJvY2Vzcy5lbnYuU01UUF9QQVNTV09SRCxcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgY29uc29sZS5sb2coJ1NNVFAgQ29uZmlndXJhdGlvbjonLCB7XHJcbiAgICBob3N0OiBzbXRwQ29uZmlnLmhvc3QsXHJcbiAgICBwb3J0OiBzbXRwQ29uZmlnLnBvcnQsXHJcbiAgICBzZWN1cmU6IHNtdHBDb25maWcuc2VjdXJlLFxyXG4gICAgdXNlcjogc210cENvbmZpZy5hdXRoLnVzZXIgPyAnKioqY29uZmlndXJlZCoqKicgOiAnTk9UX1NFVCcsXHJcbiAgICBwYXNzOiBzbXRwQ29uZmlnLmF1dGgucGFzcyA/ICcqKipjb25maWd1cmVkKioqJyA6ICdOT1RfU0VUJ1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoc210cENvbmZpZyk7XHJcbn07XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBib2R5OiBDb250YWN0Rm9ybURhdGEgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcclxuICAgIFxyXG4gICAgY29uc3QgeyBuYW1lLCBlbWFpbCwgcGhvbmUsIGlucXVpcnlUeXBlLCBwcm9ncmFtLCBtZXNzYWdlIH0gPSBib2R5O1xyXG5cclxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkc1xyXG4gICAgaWYgKCFuYW1lIHx8ICFlbWFpbCB8fCAhaW5xdWlyeVR5cGUgfHwgIW1lc3NhZ2UpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgIHsgZXJyb3I6ICdSZXF1aXJlZCBmaWVsZHM6IG5hbWUsIGVtYWlsLCBpbnF1aXJ5IHR5cGUsIGFuZCBtZXNzYWdlJyB9LFxyXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFZhbGlkYXRlIGVtYWlsIGZvcm1hdFxyXG4gICAgY29uc3QgZW1haWxSZWdleCA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvO1xyXG4gICAgaWYgKCFlbWFpbFJlZ2V4LnRlc3QoZW1haWwpKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiAnSW52YWxpZCBlbWFpbCBmb3JtYXQnIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgU01UUCBpcyBjb25maWd1cmVkXHJcbiAgICBpZiAoIXByb2Nlc3MuZW52LlNNVFBfVVNFUiB8fCAhcHJvY2Vzcy5lbnYuU01UUF9QQVNTV09SRCkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdTTVRQIG5vdCBjb25maWd1cmVkLiBNaXNzaW5nIGVudmlyb25tZW50IHZhcmlhYmxlczonLCB7XHJcbiAgICAgICAgU01UUF9IT1NUOiBwcm9jZXNzLmVudi5TTVRQX0hPU1QgfHwgJ05PVF9TRVQnLFxyXG4gICAgICAgIFNNVFBfUE9SVDogcHJvY2Vzcy5lbnYuU01UUF9QT1JUIHx8ICdOT1RfU0VUJyxcclxuICAgICAgICBTTVRQX1VTRVI6IHByb2Nlc3MuZW52LlNNVFBfVVNFUiA/ICdTRVQnIDogJ05PVF9TRVQnLFxyXG4gICAgICAgIFNNVFBfUEFTU1dPUkQ6IHByb2Nlc3MuZW52LlNNVFBfUEFTU1dPUkQgPyAnU0VUJyA6ICdOT1RfU0VUJyxcclxuICAgICAgICBTTVRQX0ZST01fRU1BSUw6IHByb2Nlc3MuZW52LlNNVFBfRlJPTV9FTUFJTCB8fCAnTk9UX1NFVCdcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBGb3IgZGV2ZWxvcG1lbnQsIGxvZyB0aGUgZm9ybSBkYXRhIGFuZCByZXR1cm4gc3VjY2Vzc1xyXG4gICAgICBjb25zb2xlLmxvZygnQ29udGFjdCBmb3JtIHN1Ym1pc3Npb24gKFNNVFAgbm90IGNvbmZpZ3VyZWQpOicsIHtcclxuICAgICAgICBuYW1lLFxyXG4gICAgICAgIGVtYWlsLFxyXG4gICAgICAgIHBob25lLFxyXG4gICAgICAgIGlucXVpcnlUeXBlLFxyXG4gICAgICAgIHByb2dyYW0sXHJcbiAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IFxyXG4gICAgICAgICAgbWVzc2FnZTogJ01lc3NhZ2UgcmVjZWl2ZWQhIChOb3RlOiBFbWFpbCBzZW5kaW5nIGlzIG5vdCBjb25maWd1cmVkIHlldCknLFxyXG4gICAgICAgICAgd2FybmluZzogJ1NNVFAgY29uZmlndXJhdGlvbiByZXF1aXJlZCBmb3IgZW1haWwgZGVsaXZlcnknLFxyXG4gICAgICAgICAgcmVjaXBpZW50RW1haWw6IEVNQUlMX1JPVVRJTkdbaW5xdWlyeVR5cGVdIHx8IEVNQUlMX1JPVVRJTkcuZ2VuZXJhbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDIwMCB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IHJlY2lwaWVudCBlbWFpbCBiYXNlZCBvbiBpbnF1aXJ5IHR5cGVcclxuICAgIGNvbnN0IHJlY2lwaWVudEVtYWlsID0gRU1BSUxfUk9VVElOR1tpbnF1aXJ5VHlwZV0gfHwgRU1BSUxfUk9VVElORy5nZW5lcmFsO1xyXG5cclxuICAgIC8vIENyZWF0ZSB0cmFuc3BvcnRlclxyXG4gICAgY29uc3QgdHJhbnNwb3J0ZXIgPSBjcmVhdGVUcmFuc3BvcnRlcigpO1xyXG5cclxuICAgIC8vIFRlc3QgdGhlIGNvbm5lY3Rpb24gZmlyc3RcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHRyYW5zcG9ydGVyLnZlcmlmeSgpO1xyXG4gICAgICBjb25zb2xlLmxvZygnU01UUCBjb25uZWN0aW9uIHZlcmlmaWVkIHN1Y2Nlc3NmdWxseScpO1xyXG4gICAgfSBjYXRjaCAodmVyaWZ5RXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignU01UUCB2ZXJpZmljYXRpb24gZmFpbGVkOicsIHZlcmlmeUVycm9yKTtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTTVRQIGNvbmZpZ3VyYXRpb24gZXJyb3I6ICR7dmVyaWZ5RXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IHZlcmlmeUVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBTTVRQIGVycm9yJ31gKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBFbWFpbCBjb250ZW50IGZvciB0aGUgcmVjaXBpZW50XHJcbiAgICBjb25zdCByZWNpcGllbnRFbWFpbENvbnRlbnQgPSB7XHJcbiAgICAgIGZyb206IHByb2Nlc3MuZW52LlNNVFBfRlJPTV9FTUFJTCB8fCBwcm9jZXNzLmVudi5TTVRQX1VTRVIsXHJcbiAgICAgIHRvOiByZWNpcGllbnRFbWFpbCxcclxuICAgICAgc3ViamVjdDogYE5ldyAke2lucXVpcnlUeXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaW5xdWlyeVR5cGUuc2xpY2UoMSl9IElucXVpcnkgZnJvbSAke25hbWV9YCxcclxuICAgICAgaHRtbDogYFxyXG4gICAgICAgIDxkaXYgc3R5bGU9XCJmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7IG1heC13aWR0aDogNjAwcHg7IG1hcmdpbjogMCBhdXRvO1wiPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICMyQjFGNEY7IGNvbG9yOiB3aGl0ZTsgcGFkZGluZzogMjBweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPlxyXG4gICAgICAgICAgICA8aDEgc3R5bGU9XCJtYXJnaW46IDA7XCI+TmV3IENvbnRhY3QgRm9ybSBTdWJtaXNzaW9uPC9oMT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwicGFkZGluZzogMjBweDsgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZjlmOTtcIj5cclxuICAgICAgICAgICAgPGgyIHN0eWxlPVwiY29sb3I6ICMyQjFGNEY7IG1hcmdpbi10b3A6IDA7XCI+Q29udGFjdCBEZXRhaWxzPC9oMj5cclxuICAgICAgICAgICAgPHRhYmxlIHN0eWxlPVwid2lkdGg6IDEwMCU7IGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XCI+XHJcbiAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogOHB4OyBmb250LXdlaWdodDogYm9sZDsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XCI+TmFtZTo8L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogOHB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RkZDtcIj4ke25hbWV9PC90ZD5cclxuICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweDsgZm9udC13ZWlnaHQ6IGJvbGQ7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1wiPkVtYWlsOjwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiA4cHg7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1wiPiR7ZW1haWx9PC90ZD5cclxuICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweDsgZm9udC13ZWlnaHQ6IGJvbGQ7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1wiPlBob25lOjwvdGQ+XHJcbiAgICAgICAgICAgICAgICA8dGQgc3R5bGU9XCJwYWRkaW5nOiA4cHg7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1wiPiR7cGhvbmUgfHwgJ05vdCBwcm92aWRlZCd9PC90ZD5cclxuICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweDsgZm9udC13ZWlnaHQ6IGJvbGQ7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1wiPklucXVpcnkgVHlwZTo8L3RkPlxyXG4gICAgICAgICAgICAgICAgPHRkIHN0eWxlPVwicGFkZGluZzogOHB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RkZDtcIj4ke2lucXVpcnlUeXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgaW5xdWlyeVR5cGUuc2xpY2UoMSl9PC90ZD5cclxuICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweDsgZm9udC13ZWlnaHQ6IGJvbGQ7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1wiPlByb2dyYW0gSW50ZXJlc3Q6PC90ZD5cclxuICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT1cInBhZGRpbmc6IDhweDsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XCI+JHtwcm9ncmFtIHx8ICdOb3Qgc3BlY2lmaWVkJ308L3RkPlxyXG4gICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8aDMgc3R5bGU9XCJjb2xvcjogIzJCMUY0RjsgbWFyZ2luLXRvcDogMjBweDtcIj5NZXNzYWdlOjwvaDM+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTsgcGFkZGluZzogMTVweDsgYm9yZGVyLWxlZnQ6IDRweCBzb2xpZCAjMDU4QzQyOyBtYXJnaW4tdG9wOiAxMHB4O1wiPlxyXG4gICAgICAgICAgICAgICR7bWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgJzxicj4nKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICMyQjFGNEY7IGNvbG9yOiB3aGl0ZTsgcGFkZGluZzogMTVweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPlxyXG4gICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbjogMDtcIj5PcHRpbXVzIEVkdWNhdGlvbiAtIENvbnRhY3QgRm9ybSBTeXN0ZW08L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgYCxcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ29uZmlybWF0aW9uIGVtYWlsIGZvciB0aGUgdXNlclxyXG4gICAgY29uc3QgY29uZmlybWF0aW9uRW1haWwgPSB7XHJcbiAgICAgIGZyb206IHByb2Nlc3MuZW52LlNNVFBfRlJPTV9FTUFJTCB8fCBwcm9jZXNzLmVudi5TTVRQX1VTRVIsXHJcbiAgICAgIHRvOiBlbWFpbCxcclxuICAgICAgc3ViamVjdDogJ1RoYW5rIHlvdSBmb3IgY29udGFjdGluZyBPcHRpbXVzIEVkdWNhdGlvbicsXHJcbiAgICAgIGh0bWw6IGBcclxuICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmOyBtYXgtd2lkdGg6IDYwMHB4OyBtYXJnaW46IDAgYXV0bztcIj5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjMkIxRjRGOyBjb2xvcjogd2hpdGU7IHBhZGRpbmc6IDIwcHg7IHRleHQtYWxpZ246IGNlbnRlcjtcIj5cclxuICAgICAgICAgICAgPGgxIHN0eWxlPVwibWFyZ2luOiAwO1wiPlRoYW5rIFlvdSBmb3IgWW91ciBJbnF1aXJ5PC9oMT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwicGFkZGluZzogMjBweDtcIj5cclxuICAgICAgICAgICAgPHA+RGVhciAke25hbWV9LDwvcD5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxwPlRoYW5rIHlvdSBmb3IgcmVhY2hpbmcgb3V0IHRvIE9wdGltdXMgRWR1Y2F0aW9uLiBXZSBoYXZlIHJlY2VpdmVkIHlvdXIgaW5xdWlyeSBhbmQgb3VyIHRlYW0gd2lsbCBnZXQgYmFjayB0byB5b3Ugd2l0aGluIDI0IGhvdXJzLjwvcD5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOiAjZjlmOWY5OyBwYWRkaW5nOiAxNXB4OyBib3JkZXItbGVmdDogNHB4IHNvbGlkICMwNThDNDI7IG1hcmdpbjogMjBweCAwO1wiPlxyXG4gICAgICAgICAgICAgIDxoMyBzdHlsZT1cImNvbG9yOiAjMkIxRjRGOyBtYXJnaW4tdG9wOiAwO1wiPllvdXIgSW5xdWlyeSBTdW1tYXJ5OjwvaDM+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5JbnF1aXJ5IFR5cGU6PC9zdHJvbmc+ICR7aW5xdWlyeVR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnF1aXJ5VHlwZS5zbGljZSgxKX08L3A+XHJcbiAgICAgICAgICAgICAgPHA+PHN0cm9uZz5Qcm9ncmFtIEludGVyZXN0Ojwvc3Ryb25nPiAke3Byb2dyYW0gfHwgJ05vdCBzcGVjaWZpZWQnfTwvcD5cclxuICAgICAgICAgICAgICA8cD48c3Ryb25nPk1lc3NhZ2U6PC9zdHJvbmc+ICR7bWVzc2FnZX08L3A+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgPHA+SW4gdGhlIG1lYW50aW1lLCBmZWVsIGZyZWUgdG8gZXhwbG9yZSBvdXIgcHJvZ3JhbXMgYW5kIHNlcnZpY2VzIG9uIG91ciB3ZWJzaXRlLjwvcD5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxwPklmIHlvdSBoYXZlIGFueSB1cmdlbnQgcXVlc3Rpb25zLCB5b3UgY2FuIGFsc28gcmVhY2ggdXMgdmlhIFdoYXRzQXBwIGF0ICs5NzE1Njk4NTIyMTEuPC9wPlxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgPHA+QmVzdCByZWdhcmRzLDxicj5cclxuICAgICAgICAgICAgVGhlIE9wdGltdXMgRWR1Y2F0aW9uIFRlYW08L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6ICMyQjFGNEY7IGNvbG9yOiB3aGl0ZTsgcGFkZGluZzogMTVweDsgdGV4dC1hbGlnbjogY2VudGVyO1wiPlxyXG4gICAgICAgICAgICA8cCBzdHlsZT1cIm1hcmdpbjogMDtcIj5PcHRpbXVzIEVkdWNhdGlvbiAtIFRyYW5zZm9ybWluZyBDYXJlZXJzLCBTaGFwaW5nIEZ1dHVyZXM8L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgYCxcclxuICAgIH07XHJcblxyXG4gICAgLy8gU2VuZCBlbWFpbHNcclxuICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIGVtYWlscyB0bzonLCByZWNpcGllbnRFbWFpbCwgJ2FuZCcsIGVtYWlsKTtcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgdHJhbnNwb3J0ZXIuc2VuZE1haWwocmVjaXBpZW50RW1haWxDb250ZW50KSxcclxuICAgICAgdHJhbnNwb3J0ZXIuc2VuZE1haWwoY29uZmlybWF0aW9uRW1haWwpXHJcbiAgICBdKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnRW1haWxzIHNlbnQgc3VjY2Vzc2Z1bGx5Jyk7XHJcblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IFxyXG4gICAgICAgIG1lc3NhZ2U6ICdDb250YWN0IGZvcm0gc3VibWl0dGVkIHN1Y2Nlc3NmdWxseS4gV2Ugd2lsbCBnZXQgYmFjayB0byB5b3Ugc29vbiEnLFxyXG4gICAgICAgIHJlY2lwaWVudEVtYWlsOiByZWNpcGllbnRFbWFpbFxyXG4gICAgICB9LFxyXG4gICAgICB7IHN0YXR1czogMjAwIH1cclxuICAgICk7XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBjb250YWN0IGZvcm0gc3VibWlzc2lvbjonLCBlcnJvcik7XHJcbiAgICBcclxuICAgIC8vIFJldHVybiBkZXRhaWxlZCBlcnJvciBpbmZvcm1hdGlvblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IFxyXG4gICAgICAgIGVycm9yOiAnRmFpbGVkIHRvIHNlbmQgZW1haWwuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyxcclxuICAgICAgICBkZXRhaWxzOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6ICdVbmtub3duIGVycm9yJyxcclxuICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxyXG4gICAgICB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBHRVQgbWV0aG9kIGZvciB0ZXN0aW5nXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgY29uc3Qgc210cENvbmZpZ3VyZWQgPSAhIShwcm9jZXNzLmVudi5TTVRQX1VTRVIgJiYgcHJvY2Vzcy5lbnYuU01UUF9QQVNTV09SRCk7XHJcbiAgXHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgeyBcclxuICAgICAgbWVzc2FnZTogJ0NvbnRhY3QgQVBJIGVuZHBvaW50IGlzIHdvcmtpbmcnLFxyXG4gICAgICBhdmFpbGFibGVJbnF1aXJ5VHlwZXM6IE9iamVjdC5rZXlzKEVNQUlMX1JPVVRJTkcpLFxyXG4gICAgICBlbWFpbFJvdXRpbmc6IEVNQUlMX1JPVVRJTkcsXHJcbiAgICAgIHNtdHBDb25maWd1cmVkLFxyXG4gICAgICBjb25maWd1cmF0aW9uOiB7XHJcbiAgICAgICAgaG9zdDogcHJvY2Vzcy5lbnYuU01UUF9IT1NUIHx8ICdOT1RfU0VUJyxcclxuICAgICAgICBwb3J0OiBwcm9jZXNzLmVudi5TTVRQX1BPUlQgfHwgJ05PVF9TRVQnLFxyXG4gICAgICAgIHVzZXI6IHByb2Nlc3MuZW52LlNNVFBfVVNFUiA/ICdTRVQnIDogJ05PVF9TRVQnLFxyXG4gICAgICAgIHBhc3N3b3JkOiBwcm9jZXNzLmVudi5TTVRQX1BBU1NXT1JEID8gJ1NFVCcgOiAnTk9UX1NFVCcsXHJcbiAgICAgICAgZnJvbUVtYWlsOiBwcm9jZXNzLmVudi5TTVRQX0ZST01fRU1BSUwgfHwgJ05PVF9TRVQnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IHN0YXR1czogMjAwIH1cclxuICApO1xyXG59ICJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJub2RlbWFpbGVyIiwiRU1BSUxfUk9VVElORyIsImdlbmVyYWwiLCJhZG1pc3Npb25zIiwic3VwcG9ydCIsIm1hcmtldGluZyIsImV4ZWN1dGl2ZSIsImNyZWF0ZVRyYW5zcG9ydGVyIiwic210cENvbmZpZyIsImhvc3QiLCJwcm9jZXNzIiwiZW52IiwiU01UUF9IT1NUIiwicG9ydCIsInBhcnNlSW50IiwiU01UUF9QT1JUIiwic2VjdXJlIiwiU01UUF9TRUNVUkUiLCJhdXRoIiwidXNlciIsIlNNVFBfVVNFUiIsInBhc3MiLCJTTVRQX1BBU1NXT1JEIiwiY29uc29sZSIsImxvZyIsImNyZWF0ZVRyYW5zcG9ydCIsIlBPU1QiLCJyZXF1ZXN0IiwiYm9keSIsImpzb24iLCJuYW1lIiwiZW1haWwiLCJwaG9uZSIsImlucXVpcnlUeXBlIiwicHJvZ3JhbSIsIm1lc3NhZ2UiLCJlcnJvciIsInN0YXR1cyIsImVtYWlsUmVnZXgiLCJ0ZXN0IiwiU01UUF9GUk9NX0VNQUlMIiwidGltZXN0YW1wIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwid2FybmluZyIsInJlY2lwaWVudEVtYWlsIiwidHJhbnNwb3J0ZXIiLCJ2ZXJpZnkiLCJ2ZXJpZnlFcnJvciIsIkVycm9yIiwicmVjaXBpZW50RW1haWxDb250ZW50IiwiZnJvbSIsInRvIiwic3ViamVjdCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJodG1sIiwicmVwbGFjZSIsImNvbmZpcm1hdGlvbkVtYWlsIiwiUHJvbWlzZSIsImFsbCIsInNlbmRNYWlsIiwiZGV0YWlscyIsIkdFVCIsInNtdHBDb25maWd1cmVkIiwiYXZhaWxhYmxlSW5xdWlyeVR5cGVzIiwiT2JqZWN0Iiwia2V5cyIsImVtYWlsUm91dGluZyIsImNvbmZpZ3VyYXRpb24iLCJwYXNzd29yZCIsImZyb21FbWFpbCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/contact/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcontact%2Froute&page=%2Fapi%2Fcontact%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontact%2Froute.ts&appDir=C%3A%5CUsers%5CRahim%5CDocuments%5CMyAPPS%5COptimusTesting%5Cproject%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CRahim%5CDocuments%5CMyAPPS%5COptimusTesting%5Cproject&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcontact%2Froute&page=%2Fapi%2Fcontact%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontact%2Froute.ts&appDir=C%3A%5CUsers%5CRahim%5CDocuments%5CMyAPPS%5COptimusTesting%5Cproject%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CRahim%5CDocuments%5CMyAPPS%5COptimusTesting%5Cproject&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Rahim_Documents_MyAPPS_OptimusTesting_project_app_api_contact_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/contact/route.ts */ \"(rsc)/./app/api/contact/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/contact/route\",\n        pathname: \"/api/contact\",\n        filename: \"route\",\n        bundlePath: \"app/api/contact/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Rahim\\\\Documents\\\\MyAPPS\\\\OptimusTesting\\\\project\\\\app\\\\api\\\\contact\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Rahim_Documents_MyAPPS_OptimusTesting_project_app_api_contact_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZjb250YWN0JTJGcm91dGUmcGFnZT0lMkZhcGklMkZjb250YWN0JTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGY29udGFjdCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNSYWhpbSU1Q0RvY3VtZW50cyU1Q015QVBQUyU1Q09wdGltdXNUZXN0aW5nJTVDcHJvamVjdCU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDUmFoaW0lNUNEb2N1bWVudHMlNUNNeUFQUFMlNUNPcHRpbXVzVGVzdGluZyU1Q3Byb2plY3QmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ3lDO0FBQ3RIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxSYWhpbVxcXFxEb2N1bWVudHNcXFxcTXlBUFBTXFxcXE9wdGltdXNUZXN0aW5nXFxcXHByb2plY3RcXFxcYXBwXFxcXGFwaVxcXFxjb250YWN0XFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9jb250YWN0L3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvY29udGFjdFwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvY29udGFjdC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXFJhaGltXFxcXERvY3VtZW50c1xcXFxNeUFQUFNcXFxcT3B0aW11c1Rlc3RpbmdcXFxccHJvamVjdFxcXFxhcHBcXFxcYXBpXFxcXGNvbnRhY3RcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcontact%2Froute&page=%2Fapi%2Fcontact%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontact%2Froute.ts&appDir=C%3A%5CUsers%5CRahim%5CDocuments%5CMyAPPS%5COptimusTesting%5Cproject%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CRahim%5CDocuments%5CMyAPPS%5COptimusTesting%5Cproject&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/nodemailer"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fcontact%2Froute&page=%2Fapi%2Fcontact%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontact%2Froute.ts&appDir=C%3A%5CUsers%5CRahim%5CDocuments%5CMyAPPS%5COptimusTesting%5Cproject%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CRahim%5CDocuments%5CMyAPPS%5COptimusTesting%5Cproject&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();