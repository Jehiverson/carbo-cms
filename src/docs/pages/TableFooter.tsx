import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput } from '../../lib';
import {
  HiPencil,/* 
  HiPlus,
  HiTrash, */
} from 'react-icons/hi';
import Swal from 'sweetalert2';
import moment from 'moment';

interface DataFooterProps {
  id: string;
  description: string;
  title: string;
  createdAt: Date;
}[];

const TableFooter: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataFooter, setDataFooter] = useState<Array<DataFooterProps>>([]);
  //const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [createdAt, setCreatedAt] = useState<Date | undefined>(new Date());

  const getData = async () => {
    const getData = await fetch('http://localhost:5000/carbografitos/us-central1/api/footer')
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataFooter) {
      setLoading(false);
      setDataFooter(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    const getDataId = await fetch(`http://localhost:5000/carbografitos/us-central1/api/footer/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setDescription(getDataId.description);
      setTitle(getDataId.title);
      setCreatedAt(getDataId.creatAt);
      setOpenModalUpdate(true);
    }
  };

  const updateData = async() =>{

      let dataUpdate = {
        "id": uid,
        "title": title,
        "description": description,
        "createdAt": createdAt,
      };

      await fetch(`http://localhost:5000/carbografitos/us-central1/api/footer`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUpdate)
      })
      .then(response => response.json())
      .then(data => { return data.data });

      cleanData();
      setLoading(true);
      setOpenModalUpdate(false);
      Swal.fire(
        'Success',
        'Your Register was update',
        'success'
      );
  }

  const cleanData = () => {
      setUid("");
      setDescription("");
      setTitle("");
      setCreatedAt(new Date());
  };

  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Footer</label>
        </div>
      </div>
      <br />
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Table>
          <Table.Head>
          <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Date Created</Table.HeadCell>
            <Table.HeadCell>Options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataFooter.length > 0?
              dataFooter.map((elementFooter, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementFooter.title}</Table.Cell>
                    <Table.Cell>{elementFooter.description}</Table.Cell>
                    <Table.Cell> {moment(elementFooter.createdAt).format("DD-MM-YYYY")}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementFooter.id)}><HiPencil /></Button>
                        {/* <Button color="failure" onClick={() => deleteData(elementFooter.id)}><HiTrash /></Button> */}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                );
              }):
              (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={4}> Data Not Found </Table.Cell>
                  </Table.Row>
              )
            }

          </Table.Body>
        </Table>
      )}

      <Modal show={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
        <Modal.Header>Update Footer</Modal.Header>
        <Modal.Body>
          <div>
            <TextInput
              type="hidden"
              value={uid}
              required={true}
              readOnly
            />
              <div className="mb-2 block">
                <Label
                  htmlFor="title"
                  value="Title"
                />
              </div>
              <TextInput
                id="title"
                type="text"
                value={title}
                required={true}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mb-2 block">
                <Label
                  htmlFor="description"
                  value="Description"
                />
              </div>
              <TextInput
                id="description"
                type="text"
                value={description}
                required={true}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="mb-2 block">
                <Label
                  htmlFor="date"
                  value="Date Created"
                />
              </div>
              <TextInput
                id="date"
                type="date"
                value={moment(createdAt).format("YYYY-MM-DD")}
                required={true}
                onChange={(e) => setCreatedAt(new Date(moment(e.target.value).format("YYYY-MM-DD hh:mm:ss")))}
              />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateData()}>Update</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableFooter;
