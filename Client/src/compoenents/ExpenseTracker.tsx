import { useState, useEffect, useRef } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import IItem from "../models/IItem";
import { getItems, postItem } from "../services/items";

const ExpenseTracker = () => {
    const [items, setItems] = useState<IItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const payeeNameRef = useRef<HTMLSelectElement | null>( null );
    const priceRef = useRef<HTMLInputElement | null>( null );
    const productRef = useRef<HTMLInputElement | null>( null );

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addItem = async () => {
        const item = {
            payeeName: payeeNameRef.current?.value || '',
            price: parseInt( priceRef.current?.value || '0' ),
            product: productRef.current?.value || '',
            setDate: (new Date()).toISOString().substr( 0, 10 )
        };

        const newItem = await postItem( item );

        setItems(
            [
                ...items,
                newItem
            ]
        );
        
        setShow( false );
    }

    const fetchItems = async () => {
        setLoading(true);
        const items = await getItems();
        setItems(items);
        setLoading(false);
    };

    const personalExpense = (payeeName: string) => {
        return items
            .filter((i) => i.payeeName === payeeName) // only items paid for by payeeName
            .reduce((acc, i) => acc + i.price, 0); // total of all items
    };

    const getPayable = () => {
        const rahulPaid = personalExpense("Rahul");
        const rameshPaid = personalExpense("Ramesh");

        return {
            payable: Math.abs(rahulPaid - rameshPaid) / 2,
            message:
                rahulPaid < rameshPaid
                    ? "Rahul has to pay"
                    : "Ramesh has to pay",
        };
    };

    useEffect(
        () => {
            fetchItems();
        },
        [] // effect function to run only on component load
    );

    return (
        <Container className="my-4">
            <h1>
                Expense Tracker
                <Button variant="primary float-end" onClick={handleShow}>
                    Add an item
                </Button>
            </h1>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add an item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="payeeName">
                            <Form.Label>Who paid?</Form.Label>
                            <Form.Select aria-label="Default select example" ref={payeeNameRef}>
                                <option value="">Select one</option>
                                <option value="Rahul">Rahul</option>
                                <option value="Ramesh">Ramesh</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="price"
                        >
                            <Form.Label>Expense amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="How much was spent? (Rs.)"
                                ref={priceRef}
                            />
                        </Form.Group>
                        
                        <Form.Group
                            className="mb-3"
                            controlId="product"
                        >
                            <Form.Label>Describe the expense</Form.Label>
                            <Form.Control
                                placeholder="How much was spent? (Rs.)"
                                ref={productRef}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addItem}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <hr />

            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Payee</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Expense</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        /* Exercise: Go through items and display a row for every expense item */
                        /* make sure to set key */
                        items.map((item) => (
                            <tr key={item.id}>
                                <td
                                    className={
                                        item.payeeName === "Rahul"
                                            ? "bg-success"
                                            : "bg-info"
                                    }
                                >
                                    {item.payeeName}
                                </td>
                                <td>{item.setDate}</td>
                                <td>{item.product}</td>
                                <td className="text-end font-monospace">
                                    {item.price}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} className="text-end">
                            Total amount spent by Rahul
                        </td>
                        <td className="text-end font-monospace">
                            {personalExpense("Rahul")}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3} className="text-end">
                            Total amount spent by Ramesh
                        </td>
                        <td className="text-end font-monospace">
                            {personalExpense("Ramesh")}
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={3} className="text-end">
                            {getPayable().message}
                        </td>
                        <td className="text-end font-monospace">
                            {getPayable().payable}
                        </td>
                    </tr>
                </tfoot>
            </Table>
        </Container>
    );
};

export default ExpenseTracker;
