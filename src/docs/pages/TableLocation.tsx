import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput } from '../../lib';
import {
  HiPencil,/* 
  HiPlus,
  HiTrash, */
} from 'react-icons/hi';
import Swal from 'sweetalert2'

interface DataLocationProps {
  id: string;
  title: string;
  description: string;
  longuitud:string;
  latitud:string;
}[];

const TableLocation: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataLocation, setDataLocation] = useState<Array<DataLocationProps>>([]);
  //const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [longuitud, setLonguitud] = useState<string | undefined>("");
  const [latitud, setLatitud] = useState<string | undefined>("");

  const getData = async () => {
    const getData = await fetch('http://localhost:5000/carbografitos/us-central1/api/location')
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataLocation) {
      setLoading(false);
      setDataLocation(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    const getDataId = await fetch(`http://localhost:5000/carbografitos/us-central1/api/location/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setTitle(getDataId.title)
      setDescription(getDataId.description);
      setLatitud(getDataId.latitud);
      setLonguitud(getDataId.longuitud);
      setOpenModalUpdate(true);
    }
  };

  const updateData = async() =>{
    
      let dataUpdate = {
        "id": uid,
        "description": description,
        "title": title,
        "longuitud": longuitud,
        "latitud": latitud
      };

      console.log(dataUpdate)

      await fetch(`http://localhost:5000/carbografitos/us-central1/api/location`,
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
      setDescription("");
      setLatitud("");
      setLonguitud("");
  };

  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Location</label>
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
            <Table.HeadCell>Latitud</Table.HeadCell>
            <Table.HeadCell>Longuitud</Table.HeadCell>
            <Table.HeadCell>Options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataLocation.length > 0?
              dataLocation.map((elementLocation, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementLocation.title}</Table.Cell>
                    <Table.Cell>{elementLocation.description}</Table.Cell>
                    <Table.Cell>{elementLocation.latitud}</Table.Cell>
                    <Table.Cell>{elementLocation.longuitud}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementLocation.id)}><HiPencil /></Button>
                        {/* <Button color="failure" onClick={() => deleteData(elementLocation.id)}><HiTrash /></Button> */}
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
        <Modal.Header>Update Product</Modal.Header>
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
                htmlFor="latitud"
                value="Latitud"
              />
            </div>
            <TextInput
              id="latitud"
              type="text"
              value={latitud}
              required={true}
              onChange={(e) => setLatitud(e.target.value)}
            />

            <div className="mb-2 block">
              <Label
                htmlFor="longuitud"
                value="Longuitud"
              />
            </div>
            <TextInput
              id="longuitud"
              type="text"
              value={longuitud}
              required={true}
              onChange={(e) => setLonguitud(e.target.value)}
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

export default TableLocation;
