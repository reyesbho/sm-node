export class CatalogController {
    constructor ({catalogModel}) {
        this.catalogModel = catalogModel;
    }

    getAll = async(req, res) => {
        const { estatus} = req.query;
        const products = await this.catalogModel.getAll({estatus});
        return res.json(products);
    }

    getById = async(req, res) => {
        const {idCatalog} = req.params;  
        const catalog = await this.catalogModel.getById({id: idCatalog});
        if (catalog == false) {
            return res.status(404).send({message: 'Catalog not found'});
        }
         return res.json(catalog);
    }

}