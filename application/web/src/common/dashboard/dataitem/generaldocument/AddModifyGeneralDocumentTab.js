import { useEffect, useState } from "react";
import { Button, Form, Grid, Header, Icon } from "semantic-ui-react";
import { request } from "../../../../util/request";
import { cloneFormDataWithNewValue, makeFormData } from "../../../form/FormData";
import { ValidatingFormTextAreaInput } from "../../../form/input/ValidatingFormTextAreaInput";
import { ValidatingFormTextFieldInput } from "../../../form/input/ValidatingFormTextFieldInput";
import { DataAddModifyTab } from "../../DataTab";

const INITIAL_FIELDS = {
  "documentFile": { value: { name: "(Empty)" }, success: true, messageList: [] }
}



/**
 * AddModifyGeneralDocumentTab
 */
export const AddModifyGeneralDocumentTab = ({ viewerId, dataParentId, documentId, titleText, dataModel, iconContent, loadDocument, saveDocument }) => {
  const [formData, setFormData] = useState(makeFormData(["documentName", "documentDescription", "documentFile"], INITIAL_FIELDS)) 
  const [doc, setDoc] = useState(null)
  useEffect(() => loadDocument({viewerId, dataParentId, documentId, doc, setDoc, dataModel }), [viewerId, documentId])
  useEffect(() => loadDocumentFields(doc, formData, setFormData), [doc])
  return (
    <DataAddModifyTab
      titleText={titleText}
      iconContent={iconContent}
      onSave={() => saveDocument({viewerId, dataParentId, documentId, dataModel, doc, formData})}
    >
      <AddModifyGeneralDocumentNameInput formData={formData} setFormData={setFormData} />
      <AddModifyGeneralDocumentDescriptionInput formData={formData} setFormData={setFormData} />
      {dataModel.upload && (
          <>
          <AddModifyGeneralDocumentFileInput 
            viewerId={viewerId}
            dataParentId={dataParentId}
            dataModel={dataModel}
            formData={formData} 
            setFormData={setFormData} 
          />
          </>
      )}
      <Button type="submit" color="blue">Save</Button>
    </DataAddModifyTab>
  )
}



/**
 * loadExistingDocument
 */
export const loadExistingDocument = ({ viewerId, dataParentId, documentId, setDoc, dataModel }) => {
  request(`/${dataModel.dashboardToken}/${viewerId}/${dataModel.dataToken}/${dataParentId}/${documentId}`).then(
      (doc) => {
          setDoc(doc);
      }
  );
}



/**
 * loadNewDocument
 */
export const loadNewDocument = ({ doc, setDoc }) => {
  if (doc == null) {
      setDoc({
          name: "",
          description: "",
          file: { name: "(Empty)" }
      })
  }
}



/**
 * saveExistingDocument
 */
export const saveExistingDocument = (saveDocumentParams) => {
  const dataModel = saveDocumentParams.dataModel
  saveDocument({ 
      ...saveDocumentParams,
      fetchUrl: `/${dataModel.dashboardToken}/${saveDocumentParams.viewerId}/${dataModel.dataToken}/${saveDocumentParams.dataParentId}/${saveDocumentParams.documentId}`,
      fetchMethod: "PATCH",
      dataModel
  })
}



/**
 * saveNewDocument
 */
export const saveNewDocument = (saveDocumentParams) => {
  const dataModel = saveDocumentParams.dataModel
  if (saveDocumentParams.dataParentId) {
    saveDocument({ 
      ...saveDocumentParams,
      fetchUrl: `/${dataModel.dashboardToken}/${saveDocumentParams.viewerId}/${dataModel.dataToken}/${saveDocumentParams.dataParentId}`,
      fetchMethod: "POST",
      dataModel
    })
    return;
  }
  return
  saveDocument({ 
      ...saveDocumentParams,
      fetchUrl: `/${dataModel.dashboardToken}/${saveDocumentParams.viewerId}/${dataModel.dataToken}`,
      fetchMethod: "POST",
      dataModel
  })
}



/**
 * AddModifyGeneralDocumentNameInput
 */
const AddModifyGeneralDocumentNameInput = ({ formData, setFormData }) => {
  return (
      <ValidatingFormTextFieldInput
          formKey="documentName"
          validating={false}
          formData={formData}
          setFormData={setFormData}
          required={false}
      />
  )
}



/**
 * AddModifyGeneralDocumentDescriptionInput
 */
const AddModifyGeneralDocumentDescriptionInput = ({ formData, setFormData }) => {
  return (
      <ValidatingFormTextAreaInput
          formKey="documentDescription"
          formData={formData}
          setFormData={setFormData}
      />
  )
}

const AddModifyGeneralDocumentFileInput = ({ viewerId, dataParentId, dataModel, formData, setFormData }) => {
  const documentFile = formData["documentFile"].value
  const documentFileHasName = documentFile.name && documentFile.name.trim() != "(Empty)"
  return (
    <Form.Field>
      <label>Document File: </label>
      <Grid>
        <Grid.Row>
          <Button
            as="label"
            htmlFor="file"
            type="button"
            style={{ width: "97%", height: "150px", marginLeft: "14px", marginTop: "10px" }}
            content={(
              <>
                <Icon name="file alternate" size="huge" style={{ paddingTop: "25px" }}/>
                <Header as="h3" style={{ marginLeft: "-40px", marginTop: "45px" }}>
                  {documentFileHasName ? (documentFile.name) : ("Upload File") }
                </Header>
              </>
            )}
          />
          <input type="file" id="file" hidden onChange={(e) => updateFile(e, viewerId, dataParentId, dataModel, formData, setFormData)} />
        </Grid.Row>
      </Grid>
    </Form.Field>
  )
}

const updateFile = (e, viewerId, dataParentId, dataModel, formData, setFormData) => {
  const file = e.target.files[0]
  if (!file) {
    return
  }
  setFormData(cloneFormDataWithNewValue(formData, "documentFile", file))
  /*
  request(`/${dataModel.dashboardToken}/${viewerId}/${dataModel.dataToken}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      files: {
        document: [file]
      }
    })
    .then((uploadedFile) => {
      const name = e.target.files[0].name
      setFormData(cloneFormDataWithNewValue(formData, "documentFile", { file: uploadedFile, name: name, url: uploadedFile.url }))
    })*/
}



/**
 * loadDocumentFields
 */
const loadDocumentFields = (doc, formData, setFormData) => {
  if (doc) {
      const formDataWithName = cloneFormDataWithNewValue(formData, "documentName", doc.name)
      const formDataWithDescription = cloneFormDataWithNewValue(formDataWithName, "documentDescription", doc.description)
      let file = { name: "(Empty) " }
      if (doc.file) {
        file = doc.file
      }
      const formDataWithFile = cloneFormDataWithNewValue(formDataWithDescription, "documentFile", file)
      setFormData(formDataWithFile)
  }
}



/**
 * saveDocument
 */
const saveDocument = ({ viewerId, dataParentId, formData, fetchUrl, fetchMethod, dataModel }) => {
  const fetchFormData = new FormData();
  const documentName = formData["documentName"].value
  const documentDescription = formData["documentDescription"].value
  if (documentName.length < 3) {
    alert("Document name must be at least 3 characters")
    return
  }
  fetchFormData.append('name', documentName)
  fetchFormData.append('description', documentDescription)
  if (dataModel.upload) {
    const documentFile = formData["documentFile"].value
    fetchFormData.append('documentFile', documentFile)
    request(fetchUrl, {
      method: fetchMethod,
      body: fetchFormData
    }).then(() => { 
      window.location.replace(`/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.dataToken}/${dataParentId}`)
    }).catch((err) => alert("ERROR: " + JSON.stringify(err)));
    return
  }
  request(fetchUrl, {
    method: fetchMethod,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: documentName,
      description: documentDescription
    })
  }).then(() => { 
    window.location.replace(`/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.dataToken}/${dataParentId}`)
  }).catch((err) => alert("ERROR: " + JSON.stringify(err)));
};