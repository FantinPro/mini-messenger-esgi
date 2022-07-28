import mongoose from 'mongoose';

const analyticSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        sessions: {
            type: [
                {
                    sessionId: {
                        type: String,
                        required: true,
                    },
                    device: {
                        type: String,
                        required: true,
                    },
                    browser: {
                        type: String,
                        required: true,
                    },
                    os: {
                        type: String,
                        required: true,
                    },
                    country: {
                        type: String,
                        required: true,
                    },
                    duration: {
                        type: Number,
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now,
                    },
                },
            ],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Analytic = mongoose.model('Analytic', analyticSchema);
export { Analytic };
