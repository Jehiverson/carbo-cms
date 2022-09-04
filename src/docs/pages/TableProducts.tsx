import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, FileInput, Select } from '../../lib';
import {
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { updateImage } from "../functions/generalFunctions";

interface DataProductsProps {
  id: string;
  title: string;
  subtitle: string;
  imgName: string;
  mvp: boolean;
  reverse: boolean;
}[];

const TableProducts: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataProducts, setDataProducts] = useState<Array<DataProductsProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [subTitle, setSubTitle] = useState<string | undefined>("");
  const [imgName, setImgName] = useState<string | undefined>("");

  const [imgFile, setImgFile] = useState<File | undefined>();
  const [mvp, setMvp] = useState<boolean | undefined | string>(false);
  const [reverse, setReverse] = useState<boolean | undefined | string>(false);

  const getData = async () => {
    const getData = await fetch('http://localhost:5000/carbografitos/us-central1/api/products')
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataProducts) {
      setLoading(false);
      setDataProducts(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    const getDataId = await fetch(`http://localhost:5000/carbografitos/us-central1/api/products/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setTitle(getDataId.title);
      setSubTitle(getDataId.subtitle);
      setImgName(getDataId.imgName);
      setMvp(getDataId.mvp);
      setReverse(getDataId.reverse);
      setOpenModalUpdate(true);
    }
  };

  const insertData = async () => {

    if (imgFile) {
      var urlImage = await updateImage(imgFile);
      if (urlImage) {

        let dataInsert = {
          "title": title,
          "imgName": urlImage,
          "subtitle": subTitle,
          "mvp": mvp,
          "reverse": reverse
        };

        await fetch(`http://localhost:5000/carbografitos/us-central1/api/products`,
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
          getData();
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

  const updateData = async() =>{
    let urlImage;
    if(imgFile){
      urlImage = await updateImage(imgFile); 
    }else{
      urlImage = imgName;
    }
    
      let dataUpdate = {
        "id": uid,
        "title": title,
        "imgName": urlImage,
        "subtitle": subTitle,
        "mvp": mvp,
        "reverse": reverse
      };

      console.log(dataUpdate)

      await fetch(`http://localhost:5000/carbografitos/us-central1/api/products`,
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

  const deleteData =async(uid:string) => {
    await fetch(`http://localhost:5000/carbografitos/us-central1/api/products`,
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
      setSubTitle("");
      setImgName("");
      setImgFile(undefined);
      setImgName("");
      setMvp(false);
      setReverse(false);
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
          <label style={{ color: 'white', fontSize: '30px' }}>Products</label>
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
            <Table.HeadCell>Sub Title</Table.HeadCell>
            <Table.HeadCell>Image</Table.HeadCell>
            <Table.HeadCell>MVP</Table.HeadCell>
            <Table.HeadCell>Reverse</Table.HeadCell>
            <Table.HeadCell>Options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataProducts.length > 0?
              dataProducts.map((elementProducts, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementProducts.title}</Table.Cell>
                    <Table.Cell>{elementProducts.subtitle}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-30" src={elementProducts.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>{elementProducts.mvp?"True":"False"}</Table.Cell>
                    <Table.Cell>{elementProducts.reverse?"True":"False"}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementProducts.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteData(elementProducts.id)}><HiTrash /></Button>
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
        <Modal.Header>Create Product</Modal.Header>
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
              value={subTitle}
              required={true}
              onChange={(e) => setSubTitle(e.target.value)}
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
              onChange={(e) => {setMvp(Boolean(e.target.value))}}
            >
              <option>
                True
              </option>
              <option>
                False
              </option>
            </Select>
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
              onChange={(e) => {setReverse(Boolean(e.target.value))}}
            >
              <option>
                True
              </option>
              <option>
                False
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
          <Button onClick={() => insertData()}>save</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

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
              value={subTitle}
              required={true}
              onChange={(e) => setSubTitle(e.target.value)}
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
              value={mvp?.toString()}
              onChange={(e) => {setMvp(Boolean(e.target.value))}}
            >
              <option>
                true
              </option>
              <option>
                false
              </option>
            </Select>
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
              value={reverse?.toString()}
              onChange={(e) => {setReverse(Boolean(e.target.value))}}
            >
              <option>
                true
              </option>
              <option>
                false
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
          <Button onClick={() => updateData()}>Update</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableProducts;
