const request = require('supertest');
const app = require('../../../api/index');

describe('POST /api/reservation', () => {
    it('creates a ticket reservation and returns a reservation id', async () => {
        const res = await request(app)
            .post('/api/reservation')
            .send({
                email: 'test@test.com',
                matchNumber: '123',
                tickets: {
                    category: 'VIP',
                    quantity: 2,
                    price: 100,
                },
                card: {
                    number: '4111111111111111',
                    expirationMonth: '12',
                    expirationYear: '2023',
                    cvc: '123',
                },
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('reservationId');
    });

    it('returns a validation error if the request body is invalid', async () => {
        const res = await request(app)
            .post('/api/reservation')
            .send({
                email: 'test@test.com',
                matchNumber: '123',
                tickets: {
                    category: 'VIP',
                    quantity: 2,
                    price: 100,
                },
                card: {
                    number: '4111111111111111',
                    expirationMonth: '12',
                    expirationYear: '2022',
                    cvc: '123',
                },
            });
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('message');
    });

    it('returns an error if the Stripe payment fails', async () => {
        const res = await request(app)
            .post('/api/reservation')
            .send({
                email: 'test@test.com',
                matchNumber: '123',
                tickets: {
                    category: 'VIP',
                    quantity: 2,
                    price: 100,
                },
                card: {
                    number: '4000000000000341',
                    expirationMonth: '12',
                    expirationYear: '2023',
                    cvc: '123',
                },
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });
});

describe('GET /api/health', () => {
    it('returns a health status message', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('Service Health');
    });
});
