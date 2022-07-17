import mongoose from 'mongoose';

//
const logSchema = new mongoose.Schema(
    {
        level: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        meta: {
            type: Object,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

// text index on message
logSchema.index({ message: 'text' });

const Log = mongoose.model('Log', logSchema);
export { Log };
