import { Ticket } from '../ticket';

const buildTicket = () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20,
        userId: '123'
    });

    return ticket;
};

it('implements optimistic concurrency control', async (done) => {
    // Create a Ticket
    const ticket = buildTicket();

    // Save the Ticket to the database
    await ticket.save();

    // Fetch the Ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes to the tickets we fetched
    firstInstance!.set('price', 10);
    secondInstance!.set('price', 15);

    // Save the first fetched ticket
    await firstInstance!.save();

    // Save the second fetched ticket and expect an error due to outdated version
    try {
        await secondInstance!.save();
    } catch (error) {
        done();
        return;
    }

    throw new Error('Should not reach this point!');
});

it('increments the version number on multiple saves', async () => {
    const ticket = buildTicket();

    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();

    expect(ticket.version).toEqual(1);

    await ticket.save();

    expect(ticket.version).toEqual(2);
});
