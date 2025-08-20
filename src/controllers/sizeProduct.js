import { validateSizeProduct,validatePartialSizeProduct } from '../schemas/sizeProduct.js';

export class SizeProductController {
    constructor({ sizeProductModel }) {
        this.sizeProductModel = sizeProductModel;
    }

    getAll = async (req, res) => {
        const { tag, estatus } = req.query;
        const sizeProducts = await this.sizeProductModel.getAll({ tag, estatus });
        return res.json(sizeProducts);
    }

    getById = async (req, res) => {
        const { id } = req.params;
        const sizeProduct = await this.sizeProductModel.getById({ id });
        if (sizeProduct == false) {
            return res.status(404).send({ message: 'Size product not found' });
        }
        return res.json(sizeProduct);
    }

    create = async (req, res) => {
        const result = validateSizeProduct(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const newSizeProduct = await this.sizeProductModel.create(result.data);
        return res.status(201).json(newSizeProduct);
    }

    update = async (req, res) => {
        const { id } = req.params;
        const result = validatePartialSizeProduct(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const updatedSizeProduct = await this.sizeProductModel.update({ id, ...result.data });

        if (updatedSizeProduct == false) {
            return res.status(404).send({ message: 'Size product not found' });
        }

        return res.json(updatedSizeProduct);
    }

    updateState = async (req, res) => {
        const { id } = req.params;
        const result = await this.sizeProductModel.updateState({ id });
        if (result == false) {
            return res.status(404).send({ message: 'Size product not found' });
        }
        return res.status(204).send('Size product update successfully');
    }

    delete = async (req, res) => {
        const { id } = req.params;
        const result = await this.sizeProductModel.delete({ id });
        if (result == false) {
            return res.status(404).send({ message: 'Size product not found' });
        }
        return res.status(204).send('Size product deleted successfully');
    }
}