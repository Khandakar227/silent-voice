import Sign, { ISign } from '@/utils/models/Sign';

export const getWordStartingWith = async (prefix: string, page = 1, limit = 20) => {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;
    const query = { word: { $regex: `^${prefix}`, $options: 'i' } };
    const signs = await Sign.find(query).skip(skip).limit(limit).sort({ word: 1 }).select('word');
    const totalItems = await Sign.countDocuments(query);

    return {
        contents: signs,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
    };
}

export const searchWord = async (keyword: string, page = 1, limit = 20) => {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;
    const query = { word: { $regex: keyword, $options: 'i' } };
    const signs = await Sign.find(query).skip(skip).limit(limit).sort({ word: 1 }).select('word');
    const totalItems = await Sign.countDocuments(query);

    return {
        contents: signs,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
    };
}

export const getWordById = async (id: string) => {
    const sign = await Sign.findOne({ _id: id });
    return sign;
}

export const getWordByWord = async (word: string) => {
    const sign = await Sign.findOne({ word });
    return sign;
}

export const updateWordByWord = async (word: string, sign: ISign) => {
    const updatedSign = await Sign.findOneAndUpdate({ word }, sign, { new: true });
    return updatedSign;
}

export const updateWordById = async (id: string, sign: ISign) => {
    const updatedSign = await Sign.findOneAndUpdate({ _id: id }, sign, { new: true });
    return updatedSign;
}

export const deleteWordByWord = async (word: string) => {
    const deletedSign = await Sign.findOneAndDelete({ word });
    return deletedSign;
}

export const createWord = async (sign: ISign) => {
    const newSign = await Sign.create(sign);
    return newSign;
}

export const createManyWords = async (signs: ISign[]) => {
    await Sign.insertMany(signs);
    return true;
}

export const getAllWords = async (page = 1, limit = 20) => {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;
    const signs = await Sign.find().skip(skip).limit(limit).sort({ word: 1 });
    const totalItems = await Sign.countDocuments();
    return {
        contents: signs,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
    };
}

export const getRandom4Words = async () => {
    const signs = await Sign.aggregate([{ $sample: { size: 4 } }]);
    return signs;
}