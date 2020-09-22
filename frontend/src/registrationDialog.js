import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import { Modal, ModalDialog, Button } from 'react-bootstrap';

export function RegistrationDialog(props) {

    const [show, setShow] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    const pages = {1: Page1, 2: Page2, 3: Page3};

    const keys = Object.keys(pages);

    keys.sort(); // because we don't know what the outcome of Object.keys method really is

    function handleCancel(event){

        // dismiss any previously saved data, require confirmation
        console.log('Handle cancel');

        setShow(false);
    }

    function isLastPage() {

        console.log('isLastPage? current: ' + currentPage + ', typeof keys:' + typeof keys + ', keys[keys.length]: ' + keys[keys.length]);

        if(currentPage == keys[keys.length]) return true;

        return false;
    }

    function handleNext(event) {

        setCurrentPage(keys[currentPage + 1]);
    }

    function handleFinish(event) {

        // TODO save aggregated data & close dialog
        setShow(false);
    }

    return (

        <ModalDialog
            show={ show }
            size={ props.size }
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <Modal.Header>

                <Modal.Title>

                    Anmeldung

                </Modal.Title>

            </Modal.Header>

            <Modal.Body>

                { pages[currentPage] }

            </Modal.Body>

            <Modal.Footer>

                <Button onClick={ handleCancel }>Cancel</Button>

                {

                isLastPage() ?

                    <Button onClick={ handleFinish } >Finish</Button>

                :

                    <Button onClick={ handleNext } >Next</Button>
                }

            </Modal.Footer>

        </ModalDialog>);
}

const Page1 = (<div>Page 1</div>);

const Page2 = (<div>Page 2</div>);

const Page3 = (<div>Page 2</div>);