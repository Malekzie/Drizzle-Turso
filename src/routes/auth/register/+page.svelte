<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { registerSchema, type RegisterSchema } from '$lib/server/database/zod-schema.js';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
    import { zodClient } from "sveltekit-superforms/adapters";


	export let data: SuperValidated<Infer<RegisterSchema>>;

    const form = superForm(data, {
        validators: zodClient(registerSchema)
    })

    const { form: formData, enhance } = form;
</script>


