import Article from "../models/article.js";

// Versión SIN middleware
// el ID del usuario viene en la URL

// GET /articles/:id
export const getUserArticles = async (req, res) => {
    // obtenemos el id directamente desde la URL
    const userId = req.params.id; // ← owner

    try {
        // busca artículos que le pertenecen al usuario
        const articles = await Article.find({ owner: userId });

        // enviamos respuesta
        res.send(articles);
    } catch (err) {
        res.status(500).send({ message: "Error getting articles" });
    }
};

// POST /articles/:id
export const createArticle = async (req, res) => {
    const { keyword, title, text, date, source, link, image } = req.body;
    const owner = req.params.id;

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
            owner,
        });

        res.status(201).send(newArticle); // lo envia como response
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const { articleId } = req.params;

        // busca el artículo por su _id y lo borra
        const deletedArticle = await Article.findByIdAndDelete(articleId);

        res.send(deletedArticle);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Cada vez que llega un pedido al servidor, es una conversación nueva desde cero. El servidor no recuerda lo que hizo en el pedido anterior.
// Cada función recibe su propio REQ con su propia info, y tiene que extraer lo que necesita por su cuenta.
