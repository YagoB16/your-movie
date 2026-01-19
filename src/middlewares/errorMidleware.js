const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno no servidor';

    console.error(`[ERRO]: ${message}`);

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

export default errorMiddleware;
