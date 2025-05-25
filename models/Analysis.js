import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    timeComplexity: {
        type: String,
        required: true
    },
    spaceComplexity: {
        type: String,
        required: true
    },
    analysisDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Analysis', analysisSchema);
