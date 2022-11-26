import React from "react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
  TextInput,
  Button,
  Group,
  Box,
  CopyButton,
} from "@mantine/core";

import { IconClipboard, IconClipboardCheck } from "@tabler/icons";

import { trpc } from "../utils/trpc";

const schema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
});

/**
 * A simple url shortener component that display a form and create a shorter version of the url
 */
const UrlShortener: React.FC = () => {
  const { data, mutate, isLoading } = trpc.shortUrl.create.useMutation();

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      url: "",
    },
    validate: zodResolver(schema),
  });

  const submitHandler = ({ url }: { url: string }) => {
    mutate(url);
  };

  const url = `http://${process.env.NEXT_PUBLIC_HOST}/${data?.targetUrl}`;

  return (
    <>
      <div className="flex grow-1 max-w-400" >
        <form onSubmit={form.onSubmit(submitHandler)}>
          <TextInput
            withAsterisk
            type="url"
            label="Url"
            autoFocus
            required
            placeholder="http://xx.yy"
            {...form.getInputProps("url")}
          />

          <Group grow position="right" mt="md">
            <Button
              variant="gradient"
              fullWidth
              loading={isLoading}
              type="submit"
            >
              Submit
            </Button>
          </Group>
        </form>
      </div>
      {data?.targetUrl && (
        <div className="flex items-center gap-4 mt-8">
          <span className="flex gap-2 text-l font-sans">
            Short url <span>:</span>
            <a href={data.targetUrl} rel="noreferrer" target="_blank">
              {url}
            </a>
          </span>
          <CopyButton value={url}>
            {({ copied, copy }) => (
              <Button
                className="transition duration-150 ease-in-out hover:-translate-y-1 hover:scale-110 active:bg-indigo-500"
                type="button"
                onClick={copy}
              >
                {copied ? <IconClipboardCheck /> : <IconClipboard />}
              </Button>
            )}
          </CopyButton>
        </div>
      )}
    </>
  );
};

export default UrlShortener;
