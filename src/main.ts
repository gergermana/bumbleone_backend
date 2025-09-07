import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import  * as dotenv from 'dotenv';

dotenv.config(); 

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: [
            "http://localhost:3000",
            "http://192.168.100.96:3000"
        ], // frontend URL
        credentials: true,
    });
    app.use(cookieParser());
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.listen(process.env.PORT ?? 8000);
    // await app.listen(8000, '0.0.0.0');
}
bootstrap();
