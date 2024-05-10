import MistralClient from '@mistralai/mistralai';
import { NextRequest, NextResponse } from "next/server";
const models = require('./models.json');

const mistral = new MistralClient(process.env.MISTRAL_API_KEY || '');

export async function GET(req: Request) : Promise<NextResponse>{
    try {
        //const response = await mistral.listModels();
        const response = models;
        return NextResponse.json(response);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { 
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            }, 
            { status: 500 }
        );
    }
}