import Article from "../models/article.js";

// GET /articles
export const getUserArticles = async (req, res) => {
    try {
        // busca artículos que le pertenecen al usuario. (req.user) <- Middleware
        const articles = await Article.find({ owner: req.user._id });

        if (!articles.length) {
            // -> si el array está vacío, responde con 404
            return res.status(404).send({ message: "No articles found" });
        }

        // enviamos respuesta
        res.send(articles);
    } catch (err) {
        res.status(500).send({ message: "Error getting articles" });
    }
};

// POST /articles
export const createArticle = async (req, res) => {
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
    } catch (error) {
        // datos inválidos o faltantes
        if (err.name === "ValidationError") {
            return res.status(400).send({ message: "Invalid data" });
        }

        res.status(500).send({ message: error.message });
    }
};

// DELETE /articles/:articleId
export const deleteArticle = async (req, res) => {
    try {
        const { articleId } = req.params;

        // busca el artículo por su _id y lo borra
        const deletedArticle = await Article.findByIdAndDelete(articleId);

        if (!deletedArticle) {
            return res.status(404).send({ message: "Article not found" });
        }

        res.send(deletedArticle);
    } catch (err) {
        // id con formato inválido
        if (err.name === "CastError") {
            return res.status(400).send({ message: "Invalid id" });
        }

        res.status(500).send({ message: err.message });
    }
};

// Cada vez que llega un pedido al servidor, es una conversación nueva desde cero. El servidor no recuerda lo que hizo en el pedido anterior.
// Cada función recibe su propio REQ con su propia info, y tiene que extraer lo que necesita por su cuenta.
