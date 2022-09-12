import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, Textarea  } from '../../lib';
import {
  HiPencil,/* 
  HiPlus,
  HiTrash, */
} from 'react-icons/hi';
import Swal from 'sweetalert2'


interface DataDescriptionLocationProps {
  id: string;
  frase:string;
  description: string;
  imgName: string;
}[];

const TableDescriptionLocation: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataDescriptionLocation, setDataDescriptionLocation] = useState<Array<DataDescriptionLocationProps>>([]);
  //const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [frase, setFrase] = useState<string | undefined>("");

  const getData = async () => {
    const getData = await fetch('http://localhost:5000/carbografitos/us-central1/api/locationdescription')
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataDescriptionLocation) {
      setLoading(false);
      setDataDescriptionLocation(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    const getDataId = await fetch(`http://localhost:5000/carbografitos/us-central1/api/locationdescription/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setDescription(getDataId.description);
      setFrase(getDataId.frase);
      setOpenModalUpdate(true);
    }
  };

  const updateData = async() =>{
    
      let dataUpdate = {
        "id": uid,
        "description": description,
        "frase":frase
      };

      console.log(dataUpdate)

      await fetch(`http://localhost:5000/carbografitos/us-central1/api/locationdescription`,
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
      setFrase("");
  };

  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Location Description</label>
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
          <Table.HeadCell>Frase</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataDescriptionLocation.length > 0?
              dataDescriptionLocation.map((elementDescriptionLocation, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementDescriptionLocation.frase}</Table.Cell>
                    <Table.Cell>{elementDescriptionLocation.description}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementDescriptionLocation.id)}><HiPencil /></Button>
                        {/* <Button color="failure" onClick={() => deleteData(elementDescriptionLocation.id)}><HiTrash /></Button> */}
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
        <Modal.Header>Update Description Location</Modal.Header>
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
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mb-2 block">
              <Label
                htmlFor="frase"
                value="Frase"
              />
            </div>
            <Textarea
              id="frase"
              rows={7}
              value={frase}
              required={true}
              onChange={(e) => setFrase(e.target.value)}
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

export default TableDescriptionLocation;
