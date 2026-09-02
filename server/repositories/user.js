import { getUsers, findUser, createUser, updateUser, deleteUser } from "../data/store.js";

export async function handleListUsers(req, res, next) {
  try {
    const { role, limit, offset } = req.query;
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    let users = await getUsers();

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    const total = users.length;
    const paginated = users.slice(offsetNum, offsetNum + limitNum);

    res.json({
      success: true,
      data: paginated,
      meta: { total, limit: limitNum, offset: offsetNum },
    });
  } catch (err) {
    next(err);
  }
}

export async function handleGetUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await findUser(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: `User with id "${id}" not found`, statusCode: 404 },
      });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function handleCreateUser(req, res, next) {
  try {
    const { email, password, name, role } = req.body;
    const user = await createUser({ email, password, name, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateUser(req, res, next) {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    const user = await updateUser(id, updates);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteUser(req, res, next) {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ success: true, data: { id } });
  } catch (err) {
    next(err);
  }
}