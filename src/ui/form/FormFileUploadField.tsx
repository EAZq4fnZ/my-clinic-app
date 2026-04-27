// src/ui/form/FormFileUploadField.tsx
import { FileUpload } from '@ark-ui/solid';
import { FieldLayout, type FieldLayoutProps } from '@ui/shared/FieldLayout';
import { For, splitProps } from 'solid-js';

export const FormFileUploadField = (
  props: Omit<FieldLayoutProps, 'children'>,
) => {
  const [local] = splitProps(props, ['label', 'field', 'helperText']);
  const getField = () =>
    typeof local.field === 'function' ? local.field() : local.field;

  return (
    <FieldLayout
      label={local.label}
      field={getField()}
      helperText={local.helperText}
    >
      <FileUpload.Root
        onFileAccept={(details) => getField().handleChange(details.files)}
        maxFiles={1}
        class="w-full"
      >
        <FileUpload.Dropzone class="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center gap-2 hover:border-blue-400 transition-colors">
          <span class="text-sm text-slate-500">
            ファイルをドラッグ＆ドロップ、または選択
          </span>
          <FileUpload.Trigger class="px-3 py-1.5 bg-white border border-slate-300 rounded text-sm font-medium hover:bg-slate-50">
            ファイルを選択
          </FileUpload.Trigger>
        </FileUpload.Dropzone>
        <FileUpload.ItemGroup class="mt-2">
          <FileUpload.Context>
            {(context) => (
              <For each={context().acceptedFiles}>
                {(file) => (
                  <FileUpload.Item
                    file={file}
                    class="text-xs text-slate-600 flex justify-between bg-slate-50 p-2 rounded"
                  >
                    <FileUpload.ItemName />
                    <FileUpload.ItemDeleteTrigger class="text-red-500">
                      削除
                    </FileUpload.ItemDeleteTrigger>
                  </FileUpload.Item>
                )}
              </For>
            )}
          </FileUpload.Context>
        </FileUpload.ItemGroup>
        <FileUpload.HiddenInput />
      </FileUpload.Root>
    </FieldLayout>
  );
};
