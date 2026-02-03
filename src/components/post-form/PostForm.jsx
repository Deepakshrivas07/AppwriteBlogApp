import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const [previewUrl, setPreviewUrl] = useState(""); // for image preview
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  // Update slug automatically based on title
  const slugTransform = useCallback((value) => {   //using usecallback hook to remember the function and to avoid unnessary renders
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    return "";
  }, []);

  // Watch title changes to auto-update slug
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  // Set preview for existing post image
  useEffect(() => {
    if (post?.featuredImage) {
      const url = appwriteService.getFileView(post.featuredImage); // ✅ Use getFileView for Appwrite file
      setPreviewUrl(url);
    }
  }, [post]);

  // Update preview when a new file is selected
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "image" && value.image?.[0]) {
        const file = value.image[0];
        const url = URL.createObjectURL(file); // local preview
        setPreviewUrl(url);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const submit = async (data) => {
    try {
      let fileId = post?.featuredImage; // default to old image
      if (data.image?.[0]) {
        const uploadedFile = await appwriteService.uploadFile(data.image[0]);
        if (uploadedFile) {
          fileId = uploadedFile.$id;
          // delete old image if editing
          if (post?.featuredImage) {
            await appwriteService.deleteFile(post.featuredImage);
          }
        }
      }

      const postData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: fileId,
      };

      let dbPost;
      if (post) {
        dbPost = await appwriteService.updatePost(post.$id, postData);
      } else {
        postData.userId = userData.$id;
        dbPost = await appwriteService.createPost(postData);
      }

      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    }catch(err) {
      console.error("PostForm submit error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })
          }
        />
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
      </div>

      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {previewUrl && (
          <div className="w-full mb-4">
            <img src={previewUrl} alt="Preview" className="rounded-lg" />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
