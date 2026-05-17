import { ListingFormData, ListingImage, AgentOption, NeighborhoodOption, CardDisplaySettings } from '@/pages/admin/listings/types';
import MultiStepPropertyForm from '@/pages/admin/listings/components/MultiStepPropertyForm';

interface Props {
  formData: ListingFormData;
  agents: AgentOption[];
  neighborhoods: NeighborhoodOption[];
  saving: boolean;
  isEdit: boolean;
  onChange: (field: keyof ListingFormData, value: string | boolean | number | string[] | Record<string, boolean> | CardDisplaySettings) => void;
  onImagesChange: (images: ListingImage[]) => void;
  onAmenitiesChange: (amenities: string[]) => void;
  onSave: () => void;
  onSubmit: () => void;
  onPublish: () => void;
  onCancel: () => void;
}

export default function ListingForm({
  formData, agents, neighborhoods, saving, isEdit,
  onChange, onImagesChange, onAmenitiesChange, onSave, onSubmit, onPublish, onCancel,
}: Props) {
  return (
    <MultiStepPropertyForm
      formData={formData}
      agents={agents}
      neighborhoods={neighborhoods}
      saving={saving}
      isEdit={isEdit}
      onChange={onChange}
      onImagesChange={onImagesChange}
      onAmenitiesChange={onAmenitiesChange}
      onSave={onSave}
      onSubmit={onSubmit}
      onPublish={onPublish}
      onCancel={onCancel}
    />
  );
}
