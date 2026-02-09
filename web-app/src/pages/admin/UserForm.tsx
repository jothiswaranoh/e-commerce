import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Select from 'react-select'
import { Mail } from 'lucide-react'

interface Props {
  formData: {
    name: string
    email: string
    role: string
    phone: string
    address: string
    status: string
  }
  setFormData: React.Dispatch<React.SetStateAction<any>>
  onSubmit: () => void
  submitText: string
  isLoading?: boolean
  onCancel: () => void
}

const roleOptions = [
  { value: 'customer', label: 'Customer' },
  { value: 'admin', label: 'Admin' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export default function UserForm({
  formData,
  setFormData,
  onSubmit,
  submitText,
  isLoading = false,
  onCancel,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="space-y-5"
    >
      <Input
        label="Full Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, name: e.target.value }))
        }
        required
      />

      <Input
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, email: e.target.value }))
        }
        leftIcon={<Mail className="w-5 h-5" />}
        required
      />

      <div>
        <label className="block text-sm font-medium mb-2">Role</label>
        <Select
          options={roleOptions}
          value={roleOptions.find(o => o.value === formData.role)}
          onChange={(o) =>
            setFormData((p: any) => ({ ...p, role: o?.value ?? '' }))
          }
        />
      </div>

      <Input
        label="Phone Number"
        value={formData.phone}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, phone: e.target.value }))
        }
      />

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) =>
          setFormData((p: any) => ({ ...p, address: e.target.value }))
        }
      />

      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <Select
          options={statusOptions}
          value={statusOptions.find(o => o.value === formData.status)}
          onChange={(o) =>
            setFormData((p: any) => ({ ...p, status: o?.value ?? 'active' }))
          }
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth isLoading={isLoading}>
          {submitText}
        </Button>
      </div>
    </form>
  )
}