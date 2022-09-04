import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, FileInput } from '../../lib';
import {
  HiPencil,/* 
  HiPlus,
  HiTrash, */
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { updateImage } from "../functions/generalFunctions";

interface DataAboutCompanyProps {
  id: string;
  description: string;
  imgName: string;
}[];

const TableAboutCompany: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataAboutCompany, setDataAboutCompany] = useState<Array<DataAboutCompanyProps>>([]);
  //const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [imgName, setImgName] = useState<string | undefined>("");
  const [imgFile, setImgFile] = useState<File | undefined>();

  const getData = async () => {
    const getData = await fetch('http://localhost:5000/carbografitos/us-central1/api/aboutus')
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataAboutCompany) {
      setLoading(false);
      setDataAboutCompany(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    const getDataId = await fetch(`http://localhost:5000/carbografitos/us-central1/api/aboutus/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setDescription(getDataId.description);
      setImgName(getDataId.imgName);
      setOpenModalUpdate(true);
    }
  };

  const updateData = async() =>{
    let urlImage;
    if(imgFile){
      urlImage = await updateImage(imgFile); 
    }else{
      urlImage = imgName;
    }
    
      let dataUpdate = {
        "id": uid,
        "description": description,
        "imgName": urlImage,
      };

      console.log(dataUpdate)

      await fetch(`http://localhost:5000/carbografitos/us-central1/api/aboutus`,
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
      setImgName("");
      setImgFile(undefined);
      setImgName("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
  };

  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>About Us</label>
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
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>Options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataAboutCompany.length > 0?
              dataAboutCompany.map((elementAboutCompany, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementAboutCompany.description}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-30" src={elementAboutCompany.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementAboutCompany.id)}><HiPencil /></Button>
                        {/* <Button color="failure" onClick={() => deleteData(elementAboutCompany.id)}><HiTrash /></Button> */}
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
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
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
          <Button onClick={() => updateData()}>Update</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableAboutCompany;
