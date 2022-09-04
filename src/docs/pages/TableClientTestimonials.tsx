import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, FileInput, Select } from '../../lib';
import {
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';
import Swal from 'sweetalert2';

import { updateImage } from "../functions/generalFunctions";

interface DataClientTestimonialsProps {
  id: string;
  name: string;
  company: string;
  description: string;
  imgName: string;
  page: boolean;
}[];

const TableClientTestimonials: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataClientTestimonials, setDataClientTestimonials] = useState<Array<DataClientTestimonialsProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [name, setName] = useState<string | undefined>("");
  const [company, setCompany] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [page, setPage] = useState<string | undefined | boolean>(false);

  const [imgName, setImgName] = useState<string | undefined>("");
  const [imgFile, setImgFile] = useState<File | undefined>();
  

  const getDataClientTestimonials = async () => {
    const getDataClientTestimonials = await fetch('http://localhost:5000/carbografitos/us-central1/api/clientTestimonials')
      .then(response => response.json())
      .then(data => { return data.data });
    
    if (dataClientTestimonials) {
      setLoading(false);
      setDataClientTestimonials(getDataClientTestimonials);
    }
  };

  const getUpdateDataClientTestimonials = async (id: string) => {
    const getDataIdClientTestimonials = await fetch(`http://localhost:5000/carbografitos/us-central1/api/clientTestimonials/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataIdClientTestimonials) {
      setUid(getDataIdClientTestimonials.id);
      setName(getDataIdClientTestimonials.name);
      setCompany(getDataIdClientTestimonials.company);
      setDescription(getDataIdClientTestimonials.description);
      setImgName(getDataIdClientTestimonials.imgName);
      setPage(getDataIdClientTestimonials.page);
      setOpenModalUpdate(true);
    }
  };

  const insertDataClientTestimonials = async () => {

    if (imgFile) {
      var urlImage = await updateImage(imgFile);
      if (urlImage) {

        let dataInsert = {
          "name": name,
          "company": company,
          "description": description,
          "page": page,
          "imgName": urlImage,
        };

        await fetch(`http://localhost:5000/carbografitos/us-central1/api/clientTestimonials`,
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
          getDataClientTestimonials();
          setOpenModal(false);

          Swal.fire(
            'Success',
            'Your Register was add',
            'success'
          );

      } else {
        //Validar cuando el archivo este vacios
      }

    }

  };

  const updateDataClientTestimonials = async() =>{
    var urlImage;
    if(imgFile){
      urlImage = await updateImage(imgFile); 
    }else{
      urlImage = imgName;
    }
    
      let dataUpdate = {
          "id":uid,
          "name": name,
          "company": company,
          "description": description,
          "page": page,
          "imgName": urlImage,
      };

      console.log(dataUpdate)

      await fetch(`http://localhost:5000/carbografitos/us-central1/api/clientTestimonials`,
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

  const deleteDataClientTestimonials =async(uid:string) => {
    await fetch(`http://localhost:5000/carbografitos/us-central1/api/clientTestimonials`,
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
      setName("");
      setCompany("");
      setDescription("");
      setPage("");
      setImgName("");
      setImgFile(undefined);
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
  };

  useEffect(() => {
    getDataClientTestimonials();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Client Testimonials</label>
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
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Company</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>IMG</Table.HeadCell>
            <Table.HeadCell>Page</Table.HeadCell>
            <Table.HeadCell>Options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataClientTestimonials.length > 0?
              dataClientTestimonials.map((elementClientTestimonials, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementClientTestimonials.name}</Table.Cell>
                    <Table.Cell>{elementClientTestimonials.company}</Table.Cell>
                    <Table.Cell>{elementClientTestimonials.description}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-30" src={elementClientTestimonials.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>{elementClientTestimonials.page}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateDataClientTestimonials(elementClientTestimonials.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteDataClientTestimonials(elementClientTestimonials.id)}><HiTrash /></Button>
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
        <Modal.Header>Create Client Testimonials</Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email1"
                value="Name"
              />
            </div>
            <TextInput
              id="email1"
              type="text"
              value={name}
              required={true}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password1"
                value="Company"
              />
            </div>
            <TextInput
              id="password1"
              type="text"
              value={company}
              required={true}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password1"
                value="description"
              />
            </div>
            <TextInput
              id="description"
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
              onChange={(e) => {setPage(e.target.value)}}
            >
              <option>
                Client Testimonials
              </option>
              <option>
                Our Team
              </option>
            </Select>
          </div>
          
          <div id="fileUpload">
            <div className="mb-2 block">
              <Label
                htmlFor="file"
                value="Image"
              />
            </div>
            <FileInput
              id="file"
              helperText="Imagen que se mostrara dentro de la plantilla"
              onChange={handleImageChange}
            />
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => insertDataClientTestimonials()}>save</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
        <Modal.Header>Update Client Testimonials</Modal.Header>
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
                value="Name"
              />
            </div>
            <TextInput
              id="title"
              type="text"
              value={name}
              required={true}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="subtitle"
                value="Company"
              />
            </div>
            <TextInput
              id="subtitle"
              type="text"
              value={company}
              required={true}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password1"
                value="description"
              />
            </div>
            <TextInput
              id="description"
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
              value={page?.toString()}
              onChange={(e) => {setPage(e.target.value)}}
            >
              <option>
                Client Testimonials
              </option>
              <option>
                Our Team
              </option>
            </Select>
          </div>

          <div id="fileUpload">
            <div className="mb-2 block">
              <Label
                htmlFor="file"
                value="Image"
              />
            </div>
            <FileInput
              id="file"
              helperText="Imagen will see in the page"
              onChange={handleImageChange}
            />
          </div>
          <img className="w-80 h-30" src={imgName} alt="Logo" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateDataClientTestimonials()}>Update</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableClientTestimonials;
