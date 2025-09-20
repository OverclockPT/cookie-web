export async function GET(request: Request) {

    //Attempt to Get Health
    try {



    } catch (error) {
        return Response.json(
            { status: "unhealthy", message: "Failed to Connect to Backend" },
            { status: 500 },
        );
    }
}