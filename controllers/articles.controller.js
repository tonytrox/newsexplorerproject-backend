import Article from "../models/article.js";

// GET /articles
export const getUserArticles = async (req, res, next) => {
    try {
        // busca artículos que le pertenecen al usuario. (req.user) <- Middleware
        const articles = await Article.find({ owner: req.user._id });

        if (!articles.length) {
            // -> si el array está vacío, responde con 404
            return next({ status: 404, message: "No articles found" });
        }

        // enviamos respuesta
        res.send(articles);
    } catch (err) {
        next(err);
    }
};

// POST /articles
export const createArticle = async (req, res, next) => {
    const { keyword, title, text, date, source, link, image } = req.body;

    try {
        // .create() hace las dos cosas en un solo paso:
        // construye el objeto Y lo guarda en la BD
        const newArticle = await Article.create({
            keyword,
            title,
            text,
            date,
            source,
            link,
            image,
            owner: req.user._id, // <- viene del token via middleware
        });

        res.status(201).send(newArticle); // lo envia como response
    } catch (err) {
        // datos inválidos o faltantes
        if (err.name === "ValidationError") {
            return next({ status: 400, message: "Invalid data" });
        }

        next(err);
    }
};

// DELETE /articles/:articleId
export const deleteArticle = async (req, res, next) => {
    try {
        const { articleId } = req.params;

        // busca el artículo por su _id y lo borra
        const deletedArticle = await Article.findByIdAndDelete(articleId);

        if (!deletedArticle) {
            return next({ status: 404, message: "Article not found" });
        }

        res.send(deletedArticle);
    } catch (err) {
        // id con formato inválido
        if (err.name === "CastError") {
            return next({ status: 400, message: "Invalid id" });
        }

        next(err);
    }
};

// Cada vez que llega un pedido al servidor, es una conversación nueva desde cero. El servidor no recuerda lo que hizo en el pedido anterior.
// Cada función recibe su propio REQ con su propia info, y tiene que extraer lo que necesita por su cuenta.
