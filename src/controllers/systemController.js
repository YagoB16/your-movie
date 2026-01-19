export const checkServer = (req, res) => {
    res.status(200).json({
        status: "Online",
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
    });
};
