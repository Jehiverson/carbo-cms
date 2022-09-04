import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, Select } from '../../lib';
import {
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';
import Swal from 'sweetalert2';

interface DataOurServicesProps {
  id: string;
  title: string;
  description: string;
  type: string;
}[];

const TableOurServices: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataOurServices, setDataOurServices] = useState<Array<DataOurServicesProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [type, setType] = useState<undefined | string>("");

  const getDataOurServices = async () => {
    const getDataOurServices = await fetch('http://localhost:5000/carbografitos/us-central1/api/ourservices')
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getDataOurServices)
    if (dataOurServices) {
      setLoading(false);
      setDataOurServices(getDataOurServices);
    }
  };

  const getUpdateDataOurServices = async (id: string) => {
    const getDataIdOurServices = await fetch(`http://localhost:5000/carbografitos/us-central1/api/ourservices/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataIdOurServices) {
      setUid(getDataIdOurServices.id);
      setTitle(getDataIdOurServices.title);
      setDescription(getDataIdOurServices.description);
      setType(getDataIdOurServices.type);
      setOpenModalUpdate(true);
    }
  };

  const insertDataOurServices = async () => {


        let dataInsert = {
          "title": title,
          "description": description,
          "type": type,
        };


        await fetch(`http://localhost:5000/carbografitos/us-central1/api/ourservices`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataInsert)
          })
          .then(response => response.json())
          .then(data => { return data.data });
          
          cleanData();
          getDataOurServices();
          setOpenModal(false);

          Swal.fire(
            'Success',
            'Your Register was add',
            'success'
          );
  };

  const updateDataOurServices = async() =>{

      let dataUpdate = {
        "id": uid,
        "title": title,
        "description": description,
        "type": type
      };

      console.log(dataUpdate)

      await fetch(`http://localhost:5000/carbografitos/us-central1/api/ourservices`,
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

  const deleteDataOurServices =async(uid:string) => {
    await fetch(`http://localhost:5000/carbografitos/us-central1/api/ourservices`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: uid})
      })
      .then(response => response.json())
      .then(data => { return data.data });
    
      setLoading(true);
  }

  const cleanData = () => {
      setUid("");
      setTitle("");
      setDescription("");
      setType("");
  };

  useEffect(() => {
    getDataOurServices();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Our Mission</label>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <Button onClick={() => {
              cleanData()
              setOpenModal(true)
              }
            }>
            Add
            <HiPlus className="ml-2 h-5 w-5" />
          </Button>
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
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataOurServices.length > 0?
              dataOurServices.map((elementOurServices, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementOurServices.title}</Table.Cell>
                    <Table.Cell>{elementOurServices.description}</Table.Cell>
                    
                    <Table.Cell>{elementOurServices.type}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateDataOurServices(elementOurServices.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteDataOurServices(elementOurServices.id)}><HiTrash /></Button>
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

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create Our Services</Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email1"
                value="Title"
              />
            </div>
            <TextInput
              id="email1"
              type="text"
              value={title}
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password1"
                value="Sub Title"
              />
            </div>
            <TextInput
              id="password1"
              type="text"
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Select Page where you will use the image"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              onChange={(e) => {setType(e.target.value)}}
            >
              <option>
                Our Services
              </option>
              <option>
                Our Specializations
              </option>
            </Select>
          </div>  
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => insertDataOurServices()}>save</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
        <Modal.Header>Update Our Services</Modal.Header>
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
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="subtitle"
                value="Subtitle"
              />
            </div>
            <TextInput
              id="subtitle"
              type="text"
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Select Page where you will use the image"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              value={type}
              onChange={(e) => {setType(e.target.value)}}
            >
              <option>
                Our Services
              </option>
              <option>
                Our Specializations
              </option>
            </Select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateDataOurServices()}>Update</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableOurServices;
