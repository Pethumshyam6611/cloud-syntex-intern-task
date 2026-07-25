import { useState } from 'react'
import { Button } from '@mui/material'
import AddRounded from '@mui/icons-material/AddRounded'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import toast from 'react-hot-toast'
import CategoryFormDialog from '../components/categories/CategoryFormDialog'
import CategoryList from '../components/categories/CategoryList'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import { useInventory } from '../hooks/useInventory'

export default function CategoriesPage() {
  const { categories, products, deleteCategory } = useInventory()
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const cannotDelete =
    deleteTarget?.productCount > 0 || categories.length <= 1

  const deleteDescription = deleteTarget
    ? deleteTarget.productCount > 0
      ? `${deleteTarget.name} is used by ${deleteTarget.productCount} ${
          deleteTarget.productCount === 1 ? 'product' : 'products'
        }. Reassign those products before deleting this category.`
      : categories.length <= 1
        ? 'At least one category must remain so new products always have a valid category.'
        : `${deleteTarget.name} will be permanently removed. This cannot be undone.`
    : ''

  const confirmDelete = () => {
    if (cannotDelete) return
    deleteCategory(deleteTarget.id)
    toast.success(`${deleteTarget.name} was deleted.`)
    setDeleteTarget(null)
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="See how products, stock units, and inventory value are distributed."
        actions={
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={() => setFormOpen(true)}
          >
            Add category
          </Button>
        }
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={CategoryOutlined}
          title="No categories available"
          description="Create a category before adding products."
          actionLabel="Create category"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <CategoryList
          categories={categories}
          products={products}
          onDelete={setDeleteTarget}
        />
      )}

      <CategoryFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={cannotDelete ? 'Category cannot be deleted' : 'Delete category?'}
        description={deleteDescription}
        confirmLabel={cannotDelete ? 'Deletion unavailable' : 'Delete category'}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        disabled={cannotDelete}
      />
    </>
  )
}
